// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title StakeToLearnCourse
 * @dev Stake-to-learn model: Users stake money, complete course, get refund
 * @author Basant Singh Dobal
 */
contract StakeToLearnCourse {
    address public owner;
    uint256 public totalEnrollments;
    uint256 public totalStaked;
    uint256 public totalRefunded;
    uint256 public totalClaimed;

    uint256 public constant GRACE_PERIOD = 5 days;

    struct CourseConfig {
        uint256 stakeAmount; // Amount to stake in wei
        uint256 duration; // Course duration in days
        uint256 requiredCompletion; // Required completion percentage (e.g., 75 for 75%)
        uint256 requiredTestAverage; // Required test average (e.g., 75 for 75%)
        uint256 dailyLearningMinutes; // Required daily learning minutes (e.g., 60 for 1 hour)
        bool active;
    }

    struct Enrollment {
        address student;
        string courseId;
        uint256 stakedAmount;
        uint256 enrollmentTime;
        uint256 courseEndTime;
        bool completed;
        bool refunded;
        bool adminClaimed;
        uint256 completionPercentage;
        uint256 testAverage;
        uint256 totalLearningMinutes;
    }

    // courseId => CourseConfig
    mapping(string => CourseConfig) public courses;

    // enrollmentId => Enrollment
    mapping(bytes32 => Enrollment) public enrollments;

    // student address => enrollmentIds
    mapping(address => bytes32[]) public studentEnrollments;

    // student => courseId => enrollmentId (prevent duplicate enrollments)
    mapping(address => mapping(string => bytes32)) public studentCourseEnrollment;

    event CourseConfigured(
        string indexed courseId,
        uint256 stakeAmount,
        uint256 duration,
        uint256 requiredCompletion,
        uint256 requiredTestAverage
    );

    event Enrolled(
        address indexed student,
        string indexed courseId,
        bytes32 indexed enrollmentId,
        uint256 stakedAmount,
        uint256 enrollmentTime,
        uint256 courseEndTime
    );

    event ProgressUpdated(
        bytes32 indexed enrollmentId,
        uint256 completionPercentage,
        uint256 testAverage,
        uint256 totalLearningMinutes
    );

    event RefundClaimed(
        address indexed student,
        bytes32 indexed enrollmentId,
        uint256 amount,
        string reason
    );

    event AdminClaimed(
        address indexed admin,
        bytes32 indexed enrollmentId,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Configure course stake requirements
     */
    function configureCourse(
        string memory courseId,
        uint256 stakeAmount,
        uint256 durationDays,
        uint256 requiredCompletion,
        uint256 requiredTestAverage,
        uint256 dailyLearningMinutes
    ) external onlyOwner {
        courses[courseId] = CourseConfig({
            stakeAmount: stakeAmount,
            duration: durationDays,
            requiredCompletion: requiredCompletion,
            requiredTestAverage: requiredTestAverage,
            dailyLearningMinutes: dailyLearningMinutes,
            active: true
        });

        emit CourseConfigured(
            courseId,
            stakeAmount,
            durationDays,
            requiredCompletion,
            requiredTestAverage
        );
    }

    /**
     * @dev Enroll in course by staking ETH
     */
    function enrollInCourse(string memory courseId) external payable {
        CourseConfig memory course = courses[courseId];
        require(course.active, "Course not active");
        require(msg.value >= course.stakeAmount, "Insufficient stake");
        require(
            studentCourseEnrollment[msg.sender][courseId] == bytes32(0),
            "Already enrolled"
        );

        bytes32 enrollmentId = keccak256(
            abi.encodePacked(msg.sender, courseId, block.timestamp)
        );

        uint256 courseEndTime = block.timestamp + (course.duration * 1 days);

        enrollments[enrollmentId] = Enrollment({
            student: msg.sender,
            courseId: courseId,
            stakedAmount: msg.value,
            enrollmentTime: block.timestamp,
            courseEndTime: courseEndTime,
            completed: false,
            refunded: false,
            adminClaimed: false,
            completionPercentage: 0,
            testAverage: 0,
            totalLearningMinutes: 0
        });

        studentEnrollments[msg.sender].push(enrollmentId);
        studentCourseEnrollment[msg.sender][courseId] = enrollmentId;

        totalEnrollments++;
        totalStaked += msg.value;

        emit Enrolled(
            msg.sender,
            courseId,
            enrollmentId,
            msg.value,
            block.timestamp,
            courseEndTime
        );

        // Refund excess payment
        if (msg.value > course.stakeAmount) {
            uint256 excess = msg.value - course.stakeAmount;
            (bool sent, ) = msg.sender.call{value: excess}("");
            require(sent, "Failed to refund excess");
        }
    }

    /**
     * @dev Update student progress (called by backend oracle)
     */
    function updateProgress(
        bytes32 enrollmentId,
        uint256 completionPercentage,
        uint256 testAverage,
        uint256 totalLearningMinutes
    ) external onlyOwner {
        Enrollment storage enrollment = enrollments[enrollmentId];
        require(enrollment.student != address(0), "Enrollment not found");
        require(!enrollment.refunded && !enrollment.adminClaimed, "Already settled");

        enrollment.completionPercentage = completionPercentage;
        enrollment.testAverage = testAverage;
        enrollment.totalLearningMinutes = totalLearningMinutes;

        emit ProgressUpdated(
            enrollmentId,
            completionPercentage,
            testAverage,
            totalLearningMinutes
        );
    }

    /**
     * @dev Check if student is eligible for refund
     */
    function isEligibleForRefund(bytes32 enrollmentId) public view returns (bool, string memory) {
        Enrollment memory enrollment = enrollments[enrollmentId];
        CourseConfig memory course = courses[enrollment.courseId];

        if (enrollment.student == address(0)) {
            return (false, "Enrollment not found");
        }

        if (enrollment.refunded) {
            return (false, "Already refunded");
        }

        if (enrollment.adminClaimed) {
            return (false, "Admin already claimed");
        }

        // Check if course period ended
        if (block.timestamp < enrollment.courseEndTime) {
            return (false, "Course period not ended");
        }

        // Check completion percentage
        if (enrollment.completionPercentage >= course.requiredCompletion) {
            return (true, "Completion requirement met");
        }

        // Check test average
        if (enrollment.testAverage >= course.requiredTestAverage) {
            return (true, "Test average requirement met");
        }

        // Check daily learning streak
        uint256 courseDurationDays = course.duration;
        uint256 requiredTotalMinutes = courseDurationDays * course.dailyLearningMinutes;
        if (enrollment.totalLearningMinutes >= requiredTotalMinutes) {
            return (true, "Learning time requirement met");
        }

        return (false, "Requirements not met");
    }

    /**
     * @dev Student claims refund if eligible
     */
    function claimRefund(bytes32 enrollmentId) external {
        Enrollment storage enrollment = enrollments[enrollmentId];
        require(enrollment.student == msg.sender, "Not your enrollment");

        (bool eligible, string memory reason) = isEligibleForRefund(enrollmentId);
        require(eligible, reason);

        enrollment.refunded = true;
        totalRefunded += enrollment.stakedAmount;

        (bool sent, ) = msg.sender.call{value: enrollment.stakedAmount}("");
        require(sent, "Refund failed");

        emit RefundClaimed(msg.sender, enrollmentId, enrollment.stakedAmount, reason);
    }

    /**
     * @dev Check if admin can claim (after grace period if student didn't meet requirements)
     */
    function canAdminClaim(bytes32 enrollmentId) public view returns (bool) {
        Enrollment memory enrollment = enrollments[enrollmentId];

        if (enrollment.student == address(0)) return false;
        if (enrollment.refunded) return false;
        if (enrollment.adminClaimed) return false;

        // Must be past course end + grace period
        if (block.timestamp < enrollment.courseEndTime + GRACE_PERIOD) {
            return false;
        }

        // Check if requirements were NOT met
        (bool eligible, ) = isEligibleForRefund(enrollmentId);
        return !eligible;
    }

    /**
     * @dev Admin claims expired stakes (students who didn't complete)
     */
    function adminClaimExpiredStake(bytes32 enrollmentId) external onlyOwner {
        require(canAdminClaim(enrollmentId), "Cannot claim yet");

        Enrollment storage enrollment = enrollments[enrollmentId];
        enrollment.adminClaimed = true;
        totalClaimed += enrollment.stakedAmount;

        (bool sent, ) = owner.call{value: enrollment.stakedAmount}("");
        require(sent, "Claim failed");

        emit AdminClaimed(owner, enrollmentId, enrollment.stakedAmount);
    }

    /**
     * @dev Get enrollment details
     */
    function getEnrollment(bytes32 enrollmentId) external view returns (
        address student,
        string memory courseId,
        uint256 stakedAmount,
        uint256 enrollmentTime,
        uint256 courseEndTime,
        bool completed,
        bool refunded,
        bool adminClaimed,
        uint256 completionPercentage,
        uint256 testAverage,
        uint256 totalLearningMinutes
    ) {
        Enrollment memory e = enrollments[enrollmentId];
        return (
            e.student,
            e.courseId,
            e.stakedAmount,
            e.enrollmentTime,
            e.courseEndTime,
            e.completed,
            e.refunded,
            e.adminClaimed,
            e.completionPercentage,
            e.testAverage,
            e.totalLearningMinutes
        );
    }

    /**
     * @dev Get student's enrollments
     */
    function getStudentEnrollments(address student) external view returns (bytes32[] memory) {
        return studentEnrollments[student];
    }

    /**
     * @dev Get course config
     */
    function getCourseConfig(string memory courseId) external view returns (
        uint256 stakeAmount,
        uint256 duration,
        uint256 requiredCompletion,
        uint256 requiredTestAverage,
        uint256 dailyLearningMinutes,
        bool active
    ) {
        CourseConfig memory c = courses[courseId];
        return (
            c.stakeAmount,
            c.duration,
            c.requiredCompletion,
            c.requiredTestAverage,
            c.dailyLearningMinutes,
            c.active
        );
    }

    /**
     * @dev Get contract stats
     */
    function getStats() external view returns (
        uint256 _totalEnrollments,
        uint256 _totalStaked,
        uint256 _totalRefunded,
        uint256 _totalClaimed,
        uint256 _currentBalance
    ) {
        return (
            totalEnrollments,
            totalStaked,
            totalRefunded,
            totalClaimed,
            address(this).balance
        );
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    receive() external payable {}
}
