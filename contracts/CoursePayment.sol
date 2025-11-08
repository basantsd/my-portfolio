// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CoursePayment
 * @dev Smart contract for handling course purchases with ETH
 * @author Basant Singh Dobal
 */
contract CoursePayment {
    address public owner;
    uint256 public totalCoursePurchases;
    uint256 public totalRevenue;

    struct Purchase {
        address buyer;
        string courseId;
        uint256 amount;
        uint256 timestamp;
        bool refunded;
    }

    // Mapping from transaction hash to purchase details
    mapping(bytes32 => Purchase) public purchases;

    // Mapping from user address to their purchases
    mapping(address => bytes32[]) public userPurchases;

    // Mapping from courseId to price in wei
    mapping(string => uint256) public coursePrices;

    event CoursePurchased(
        address indexed buyer,
        string indexed courseId,
        uint256 amount,
        bytes32 indexed purchaseId,
        uint256 timestamp
    );

    event PriceUpdated(
        string indexed courseId,
        uint256 oldPrice,
        uint256 newPrice
    );

    event RefundIssued(
        address indexed buyer,
        string indexed courseId,
        uint256 amount,
        bytes32 indexed purchaseId
    );

    event FundsWithdrawn(
        address indexed owner,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Set course price in wei
     * @param courseId Unique identifier for the course
     * @param priceInWei Price in wei (1 ETH = 10^18 wei)
     */
    function setCoursePrice(string memory courseId, uint256 priceInWei) external onlyOwner {
        uint256 oldPrice = coursePrices[courseId];
        coursePrices[courseId] = priceInWei;
        emit PriceUpdated(courseId, oldPrice, priceInWei);
    }

    /**
     * @dev Purchase a course with ETH
     * @param courseId Unique identifier for the course
     */
    function purchaseCourse(string memory courseId) external payable {
        uint256 price = coursePrices[courseId];
        require(price > 0, "Course price not set");
        require(msg.value >= price, "Insufficient payment");

        // Generate unique purchase ID
        bytes32 purchaseId = keccak256(
            abi.encodePacked(msg.sender, courseId, block.timestamp, block.number)
        );

        // Store purchase details
        purchases[purchaseId] = Purchase({
            buyer: msg.sender,
            courseId: courseId,
            amount: msg.value,
            timestamp: block.timestamp,
            refunded: false
        });

        // Track user purchases
        userPurchases[msg.sender].push(purchaseId);

        // Update stats
        totalCoursePurchases++;
        totalRevenue += msg.value;

        emit CoursePurchased(msg.sender, courseId, msg.value, purchaseId, block.timestamp);

        // Refund excess payment if any
        if (msg.value > price) {
            uint256 excess = msg.value - price;
            (bool sent, ) = msg.sender.call{value: excess}("");
            require(sent, "Failed to refund excess payment");
        }
    }

    /**
     * @dev Issue refund for a purchase (within refund period)
     * @param purchaseId Unique identifier for the purchase
     */
    function refundPurchase(bytes32 purchaseId) external onlyOwner {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.buyer != address(0), "Purchase not found");
        require(!purchase.refunded, "Already refunded");

        purchase.refunded = true;
        totalRevenue -= purchase.amount;

        (bool sent, ) = purchase.buyer.call{value: purchase.amount}("");
        require(sent, "Failed to send refund");

        emit RefundIssued(purchase.buyer, purchase.courseId, purchase.amount, purchaseId);
    }

    /**
     * @dev Verify if a user has purchased a specific course
     * @param user Address of the user
     * @param courseId Unique identifier for the course
     */
    function hasPurchased(address user, string memory courseId) external view returns (bool) {
        bytes32[] memory userPurchaseIds = userPurchases[user];

        for (uint256 i = 0; i < userPurchaseIds.length; i++) {
            Purchase memory purchase = purchases[userPurchaseIds[i]];
            if (
                keccak256(abi.encodePacked(purchase.courseId)) == keccak256(abi.encodePacked(courseId)) &&
                !purchase.refunded
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Get all purchases by a user
     * @param user Address of the user
     */
    function getUserPurchases(address user) external view returns (bytes32[] memory) {
        return userPurchases[user];
    }

    /**
     * @dev Get purchase details
     * @param purchaseId Unique identifier for the purchase
     */
    function getPurchase(bytes32 purchaseId) external view returns (
        address buyer,
        string memory courseId,
        uint256 amount,
        uint256 timestamp,
        bool refunded
    ) {
        Purchase memory purchase = purchases[purchaseId];
        return (
            purchase.buyer,
            purchase.courseId,
            purchase.amount,
            purchase.timestamp,
            purchase.refunded
        );
    }

    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool sent, ) = owner.call{value: balance}("");
        require(sent, "Failed to withdraw funds");

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @dev Transfer ownership
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Receive function to accept ETH
    receive() external payable {}
}
