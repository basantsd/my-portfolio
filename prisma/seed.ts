import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@basantsd.com' },
    update: {},
    create: {
      email: 'admin@basantsd.com',
      name: 'Basant Singh Dobal',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create projects
  const projects = [
    {
      title: 'DeFi Lending Protocol',
      slug: 'defi-lending-protocol',
      description: 'A decentralized lending platform built on Ethereum with automated market-making and liquidity pools. Features flash loans, collateral management, and yield farming.',
      content: `<h2>Project Overview</h2>
<p>A fully functional DeFi lending protocol that allows users to lend and borrow crypto assets with variable interest rates determined by supply and demand.</p>

<h3>Key Features</h3>
<ul>
  <li>Collateralized lending and borrowing</li>
  <li>Flash loan functionality for arbitrage and liquidation</li>
  <li>Automated market maker (AMM) for interest rate determination</li>
  <li>Yield farming with LP tokens</li>
  <li>Liquidation engine for undercollateralized positions</li>
</ul>

<h3>Technical Stack</h3>
<ul>
  <li>Smart Contracts: Solidity 0.8.19</li>
  <li>Testing: Hardhat, Chai</li>
  <li>Frontend: React, ethers.js</li>
  <li>Deployment: Ethereum mainnet and testnets</li>
</ul>

<h3>Security</h3>
<p>This protocol has been audited by leading security firms and implements best practices including reentrancy guards, access controls, and emergency pause functionality.</p>`,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop',
      ],
      tags: ['Solidity', 'Ethereum', 'DeFi', 'React', 'Hardhat'],
      githubUrl: 'https://github.com/basantsd/defi-lending',
      liveUrl: 'https://defi-lending-demo.vercel.app',
      featured: true,
      status: 'COMPLETED',
      order: 1,
    },
    {
      title: 'NFT Marketplace',
      slug: 'nft-marketplace',
      description: 'Full-stack NFT marketplace with minting, trading, and royalty management features. Supports ERC-721 and ERC-1155 standards with IPFS storage.',
      content: `<h2>NFT Marketplace Platform</h2>
<p>A comprehensive NFT marketplace that supports both ERC-721 and ERC-1155 tokens with advanced features for creators and collectors.</p>

<h3>Features</h3>
<ul>
  <li>Lazy minting to save gas costs</li>
  <li>Auction and fixed-price listings</li>
  <li>Royalty payments for creators</li>
  <li>IPFS metadata storage</li>
  <li>Collection management</li>
  <li>Rarity scoring and filtering</li>
</ul>

<h3>Smart Contracts</h3>
<ul>
  <li>Marketplace contract with escrow functionality</li>
  <li>ERC-721 and ERC-1155 implementations</li>
  <li>Royalty distribution contract</li>
  <li>Upgradeable proxy pattern</li>
</ul>`,
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
      ],
      tags: ['Solidity', 'IPFS', 'Next.js', 'Web3', 'TheGraph'],
      githubUrl: 'https://github.com/basantsd/nft-marketplace',
      liveUrl: 'https://nft-marketplace-demo.vercel.app',
      featured: true,
      status: 'COMPLETED',
      order: 2,
    },
    {
      title: 'DAO Governance Platform',
      slug: 'dao-governance',
      description: 'Decentralized governance platform with proposal creation, voting, and treasury management. Implements timelock and multi-signature functionality.',
      content: `<h2>DAO Governance System</h2>
<p>A fully decentralized governance platform enabling token holders to propose and vote on organizational decisions.</p>

<h3>Governance Features</h3>
<ul>
  <li>Proposal creation and voting</li>
  <li>Quadratic voting mechanism</li>
  <li>Timelock for proposal execution</li>
  <li>Multi-signature treasury</li>
  <li>Delegation of voting power</li>
</ul>`,
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop',
      ],
      tags: ['Solidity', 'Hardhat', 'TypeScript', 'DAO', 'OpenZeppelin'],
      githubUrl: 'https://github.com/basantsd/dao-governance',
      liveUrl: 'https://dao-platform-demo.vercel.app',
      featured: true,
      status: 'IN_PROGRESS',
      order: 3,
    },
    {
      title: 'Token Vesting Contract',
      slug: 'token-vesting',
      description: 'Secure token vesting smart contract with cliff periods, linear vesting, and revocation functionality for team and investor token distribution.',
      content: `<h2>Token Vesting Solution</h2>
<p>Enterprise-grade token vesting contracts for secure team and investor token distribution.</p>

<h3>Vesting Options</h3>
<ul>
  <li>Linear vesting over custom periods</li>
  <li>Cliff periods before vesting starts</li>
  <li>Revocable and non-revocable schedules</li>
  <li>Multiple beneficiary support</li>
</ul>`,
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=600&fit=crop',
      images: [],
      tags: ['Solidity', 'Security', 'ERC-20', 'Foundry'],
      githubUrl: 'https://github.com/basantsd/token-vesting',
      liveUrl: '',
      featured: false,
      status: 'COMPLETED',
      order: 4,
    },
    {
      title: 'Cross-Chain Bridge',
      slug: 'cross-chain-bridge',
      description: 'Bridge protocol for transferring assets between Ethereum and Polygon. Features liquidity pools, fee optimization, and security mechanisms.',
      content: `<h2>Cross-Chain Bridge Protocol</h2>
<p>Secure asset bridge between Ethereum and Polygon networks with optimized gas costs.</p>`,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      images: [],
      tags: ['Solidity', 'Polygon', 'Bridge', 'Security'],
      githubUrl: 'https://github.com/basantsd/cross-chain-bridge',
      liveUrl: '',
      featured: false,
      status: 'COMPLETED',
      order: 5,
    },
    {
      title: 'Yield Farming Protocol',
      slug: 'yield-farming',
      description: 'DeFi yield farming protocol with staking, rewards distribution, and auto-compounding features. Optimized for gas efficiency.',
      content: `<h2>Yield Farming Platform</h2>
<p>Gas-optimized yield farming protocol with auto-compounding rewards.</p>`,
      image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=600&fit=crop',
      images: [],
      tags: ['Solidity', 'DeFi', 'Staking', 'Gas Optimization'],
      githubUrl: 'https://github.com/basantsd/yield-farming',
      liveUrl: '',
      featured: false,
      status: 'UPCOMING',
      order: 6,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }
  console.log('✅ Projects seeded')

  // Create blog posts with full HTML content
  const blogPosts = [
    {
      title: 'Getting Started with Solidity Smart Contracts',
      slug: 'getting-started-solidity',
      excerpt: 'Learn the fundamentals of Solidity and how to write your first smart contract on Ethereum.',
      content: `<h2>Introduction to Solidity</h2>
<p>Solidity is a statically-typed programming language designed for developing smart contracts that run on the Ethereum Virtual Machine (EVM).</p>

<h3>Why Learn Solidity?</h3>
<ul>
  <li>Most popular smart contract language</li>
  <li>Powers majority of DeFi applications</li>
  <li>High demand in the job market</li>
  <li>Foundation for other blockchain languages</li>
</ul>

<h3>Your First Smart Contract</h3>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;

    event DataStored(uint256 indexed newValue, address indexed sender);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x, msg.sender);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}</code></pre>

<h3>Key Concepts</h3>
<p><strong>State Variables:</strong> Variables that permanently store data on the blockchain.</p>
<p><strong>Events:</strong> Allow logging on the blockchain for off-chain applications to track contract activity.</p>
<p><strong>Functions:</strong> Executable units of code within a contract.</p>

<h3>Best Practices</h3>
<ul>
  <li>Always use the latest stable Solidity version</li>
  <li>Follow the Checks-Effects-Interactions pattern</li>
  <li>Use OpenZeppelin contracts for standards</li>
  <li>Write comprehensive tests before deployment</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
      tags: ['Solidity', 'Ethereum', 'Tutorial', 'Beginner'],
      published: true,
      readTime: 8,
      views: 1234,
    },
    {
      title: 'DeFi Protocol Security: Best Practices',
      slug: 'defi-security-best-practices',
      excerpt: 'Essential security considerations when building DeFi protocols and how to protect against common vulnerabilities.',
      content: `<h2>Securing Your DeFi Protocol</h2>
<p>DeFi protocols handle billions of dollars, making security paramount. This guide covers essential security practices.</p>

<h3>Common Vulnerabilities</h3>
<ul>
  <li><strong>Reentrancy:</strong> Prevent with checks-effects-interactions pattern</li>
  <li><strong>Flash Loan Attacks:</strong> Implement price manipulation guards</li>
  <li><strong>Oracle Manipulation:</strong> Use decentralized oracles like Chainlink</li>
  <li><strong>Front-running:</strong> Consider using commit-reveal schemes</li>
</ul>

<h3>Security Checklist</h3>
<ol>
  <li>Comprehensive unit and integration tests</li>
  <li>Professional security audit</li>
  <li>Bug bounty program</li>
  <li>Emergency pause functionality</li>
  <li>Timelock for critical operations</li>
</ol>`,
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
      tags: ['DeFi', 'Security', 'Best Practices', 'Advanced'],
      published: true,
      readTime: 12,
      views: 2156,
    },
    {
      title: 'Building NFT Marketplaces: Complete Guide',
      slug: 'nft-marketplace-guide',
      excerpt: 'A comprehensive guide to building your own NFT marketplace with ERC-721 and ERC-1155 support.',
      content: `<h2>Creating Your NFT Marketplace</h2>
<p>NFT marketplaces combine smart contracts, IPFS storage, and modern web technologies. This guide walks you through building one from scratch.</p>

<h3>Architecture Overview</h3>
<ul>
  <li>Smart contracts for minting, listing, and trading</li>
  <li>IPFS for decentralized metadata storage</li>
  <li>Frontend with Web3 integration</li>
  <li>Indexing layer (TheGraph) for queries</li>
</ul>

<h3>Smart Contract Structure</h3>
<pre><code>contract NFTMarketplace {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    function createListing(uint256 tokenId, uint256 price) external {
        // Implementation
    }

    function buyNFT(uint256 tokenId) external payable {
        // Implementation
    }
}</code></pre>`,
      coverImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&h=600&fit=crop',
      tags: ['NFT', 'Marketplace', 'Guide', 'ERC-721'],
      published: true,
      readTime: 15,
      views: 3421,
    },
    {
      title: 'Gas Optimization Techniques in Solidity',
      slug: 'gas-optimization-solidity',
      excerpt: 'Learn advanced techniques to optimize gas costs in your smart contracts and save users money.',
      content: `<h2>Gas Optimization Strategies</h2>
<p>Reducing gas costs improves user experience and makes your DApp more competitive.</p>

<h3>Optimization Techniques</h3>
<ul>
  <li>Use calldata instead of memory for read-only parameters</li>
  <li>Pack storage variables efficiently</li>
  <li>Use uint256 instead of smaller types</li>
  <li>Cache storage variables in memory</li>
  <li>Use events for data that doesn't need to be on-chain</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=600&fit=crop',
      tags: ['Solidity', 'Optimization', 'Gas', 'Advanced'],
      published: true,
      readTime: 10,
      views: 1876,
    },
    {
      title: 'Web3 Authentication: A Complete Guide',
      slug: 'web3-authentication-guide',
      excerpt: 'Implement secure Web3 authentication in your DApp using MetaMask and WalletConnect.',
      content: `<h2>Web3 Authentication</h2>
<p>Learn how to implement secure wallet-based authentication in your DApps.</p>

<h3>Authentication Flow</h3>
<ol>
  <li>Connect to wallet (MetaMask/WalletConnect)</li>
  <li>Request signature for login message</li>
  <li>Verify signature on backend</li>
  <li>Issue session token</li>
</ol>`,
      coverImage: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&h=600&fit=crop',
      tags: ['Web3', 'Authentication', 'DApp', 'MetaMask'],
      published: true,
      readTime: 9,
      views: 2543,
    },
    {
      title: 'Understanding EVM and How It Works',
      slug: 'understanding-evm',
      excerpt: 'Deep dive into the Ethereum Virtual Machine and how smart contracts are executed.',
      content: `<h2>The Ethereum Virtual Machine</h2>
<p>The EVM is a decentralized computer that executes smart contracts across thousands of nodes.</p>

<h3>How EVM Works</h3>
<ul>
  <li>Stack-based architecture</li>
  <li>256-bit word size</li>
  <li>Gas metering for computation</li>
  <li>Deterministic execution</li>
</ul>`,
      coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=600&fit=crop',
      tags: ['Ethereum', 'EVM', 'Advanced', 'Architecture'],
      published: true,
      readTime: 14,
      views: 1654,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }
  console.log('✅ Blog posts seeded')

  // Create courses with modules and lessons
  const course1 = await prisma.course.upsert({
    where: { slug: 'solidity-smart-contracts' },
    update: {},
    create: {
      title: 'Complete Solidity & Smart Contracts Course',
      slug: 'solidity-smart-contracts',
      description: 'Master Solidity development from basics to advanced concepts. Build real-world DeFi protocols and NFT projects.',
      content: JSON.stringify({
        features: [
          'Smart contract development from scratch',
          'Security best practices and auditing',
          'DeFi protocol building',
          'NFT marketplace creation',
          'Testing with Hardhat and Foundry',
          'Real-world projects portfolio',
        ],
        learningOutcomes: [
          'Write secure and efficient smart contracts in Solidity',
          'Build and deploy DeFi protocols',
          'Create NFT collections and marketplaces',
          'Implement comprehensive testing strategies',
          'Understand and prevent security vulnerabilities',
          'Optimize contracts for gas efficiency',
        ],
        requirements: [
          'Basic programming knowledge',
          'Understanding of blockchain concepts',
          'A computer with internet connection',
          'MetaMask wallet',
        ],
        includes: [
          '85 video lessons (20+ hours)',
          'Downloadable code for all projects',
          '6 hands-on projects',
          'Certificate of completion',
          'Lifetime access',
          'Discord community',
        ],
      }),
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
      price: 99,
      isPremium: true,
      published: true,
      level: 'BEGINNER',
      duration: 1200,
    },
  })

  // Add modules for course 1
  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Blockchain & Solidity',
      order: 1,
      lessons: {
        create: [
          {
            title: 'Course Introduction & Setup',
            description: 'Welcome to the course and setting up your development environment',
            videoUrl: 'https://example.com/video1',
            duration: 15,
            order: 1,
            isFree: true,
          },
          {
            title: 'Blockchain Fundamentals',
            description: 'Understanding how blockchain technology works',
            videoUrl: 'https://example.com/video2',
            duration: 20,
            order: 2,
            isFree: true,
          },
          {
            title: 'Introduction to Ethereum',
            description: 'Overview of the Ethereum blockchain',
            videoUrl: 'https://example.com/video3',
            duration: 18,
            order: 3,
            isFree: false,
          },
          {
            title: 'Your First Smart Contract',
            description: 'Writing and deploying your first smart contract',
            videoUrl: 'https://example.com/video4',
            duration: 25,
            order: 4,
            isFree: false,
          },
        ],
      },
    },
  })

  const module2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Advanced Solidity Concepts',
      order: 2,
      lessons: {
        create: [
          {
            title: 'Inheritance & Interfaces',
            description: 'Object-oriented programming in Solidity',
            videoUrl: 'https://example.com/video5',
            duration: 25,
            order: 1,
            isFree: false,
          },
          {
            title: 'Events & Logging',
            description: 'Using events for off-chain communication',
            videoUrl: 'https://example.com/video6',
            duration: 18,
            order: 2,
            isFree: false,
          },
          {
            title: 'Error Handling',
            description: 'Proper error handling with require, assert, and revert',
            videoUrl: 'https://example.com/video7',
            duration: 20,
            order: 3,
            isFree: false,
          },
        ],
      },
    },
  })

  console.log('✅ Course 1 with modules and lessons seeded')

  const course2 = await prisma.course.upsert({
    where: { slug: 'defi-development' },
    update: {},
    create: {
      title: 'DeFi Development Masterclass',
      slug: 'defi-development',
      description: 'Build production-ready DeFi protocols including DEXs, lending platforms, and yield farming systems.',
      content: JSON.stringify({
        features: [
          'Advanced DeFi concepts',
          'AMM implementation',
          'Lending protocols',
          'Flash loans',
          'Yield optimization',
          'Security auditing',
        ],
        learningOutcomes: [
          'Build decentralized exchanges',
          'Implement lending and borrowing protocols',
          'Create yield farming systems',
          'Understand flash loan mechanics',
          'Perform security audits',
        ],
        requirements: [
          'Solid understanding of Solidity',
          'Experience with DeFi platforms',
          'Basic understanding of financial concepts',
        ],
        includes: [
          '102 video lessons (30+ hours)',
          'Production-ready code',
          'Security audit checklist',
          'Advanced projects',
        ],
      }),
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
      price: 149,
      isPremium: true,
      published: true,
      level: 'INTERMEDIATE',
      duration: 1800,
    },
  })

  await prisma.courseModule.create({
    data: {
      courseId: course2.id,
      title: 'DeFi Fundamentals',
      order: 1,
      lessons: {
        create: [
          {
            title: 'Understanding DeFi Primitives',
            description: 'Core concepts of decentralized finance',
            videoUrl: 'https://example.com/defi1',
            duration: 25,
            order: 1,
            isFree: true,
          },
          {
            title: 'Building a DEX - Part 1',
            description: 'Creating your first decentralized exchange',
            videoUrl: 'https://example.com/defi2',
            duration: 35,
            order: 2,
            isFree: false,
          },
        ],
      },
    },
  })

  console.log('✅ Course 2 with modules seeded')

  // Create NFT course
  const course3 = await prisma.course.upsert({
    where: { slug: 'nft-marketplace' },
    update: {},
    create: {
      title: 'NFT Development & Marketplace',
      slug: 'nft-marketplace',
      description: 'Create your own NFT collection and build a fully functional NFT marketplace with minting and trading.',
      content: JSON.stringify({
        features: [
          'ERC-721 & ERC-1155 standards',
          'IPFS integration',
          'Minting mechanisms',
          'Marketplace development',
          'Royalty implementation',
        ],
        learningOutcomes: [
          'Implement NFT standards',
          'Build NFT marketplaces',
          'Integrate IPFS storage',
          'Handle royalties',
        ],
        requirements: [
          'Basic Solidity knowledge',
          'Understanding of NFTs',
        ],
        includes: [
          '68 video lessons',
          'NFT collection project',
          'Marketplace template',
        ],
      }),
      thumbnail: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&h=600&fit=crop',
      price: 79,
      isPremium: false,
      published: true,
      level: 'BEGINNER',
      duration: 900,
    },
  })

  console.log('✅ Courses seeded')

  // Create section-based course with tests
  const sectionCourse = await prisma.course.upsert({
    where: { slug: 'web3-fundamentals' },
    update: {},
    create: {
      title: 'Web3 Fundamentals with Progressive Learning',
      slug: 'web3-fundamentals',
      description: 'Master Web3 development with our progressive learning system. Complete tests to unlock new sections and earn your NFT certificate.',
      content: JSON.stringify({
        features: [
          'Progressive section unlock system',
          'Interactive tests after each section',
          'Hands-on coding exercises',
          'NFT certificate upon completion',
          'Real-world project portfolio',
        ],
        learningOutcomes: [
          'Understand blockchain and Web3 fundamentals',
          'Write and deploy smart contracts',
          'Build decentralized applications',
          'Connect with MetaMask and Web3 providers',
          'Master testing and security best practices',
        ],
        requirements: [
          'Basic JavaScript knowledge',
          'Familiarity with React',
          'MetaMask wallet installed',
        ],
        includes: [
          '50 video lessons (15+ hours)',
          'Section completion tests',
          'Downloadable resources',
          'NFT certificate',
          'Lifetime access',
        ],
      }),
      thumbnail: 'https://images.unsplash.com/photo-1639322537228-f564d14b456a?w=1200&h=600&fit=crop',
      price: 49,
      isPremium: false,
      published: true,
      level: 'BEGINNER',
      duration: 900,
    },
  })

  // Section 1: Introduction (No test, always unlocked)
  const section1 = await prisma.courseSection.create({
    data: {
      courseId: sectionCourse.id,
      title: 'Introduction to Web3',
      description: 'Get started with Web3 and blockchain basics',
      order: 0,
      requireTest: false,
      topics: {
        create: [
          {
            title: 'Welcome to Web3',
            description: 'Course overview and what you\'ll build',
            videoUrl: 'https://example.com/web3-intro.mp4',
            duration: 10,
            order: 0,
            isFree: true,
          },
          {
            title: 'Blockchain Basics',
            description: 'Understanding how blockchain technology works',
            videoUrl: 'https://example.com/blockchain-basics.mp4',
            duration: 15,
            order: 1,
            isFree: true,
          },
          {
            title: 'Setting Up Your Environment',
            description: 'Install MetaMask, Node.js, and development tools',
            videoUrl: 'https://example.com/setup.mp4',
            duration: 12,
            order: 2,
            isFree: false,
          },
        ],
      },
    },
  })

  // Section 2: Smart Contracts (Requires test to unlock next)
  const section2 = await prisma.courseSection.create({
    data: {
      courseId: sectionCourse.id,
      title: 'Smart Contracts with Solidity',
      description: 'Learn to write and deploy smart contracts',
      order: 1,
      requireTest: true,
      topics: {
        create: [
          {
            title: 'Introduction to Solidity',
            description: 'Solidity syntax and basic concepts',
            videoUrl: 'https://example.com/solidity-intro.mp4',
            duration: 20,
            order: 0,
            isFree: false,
          },
          {
            title: 'Data Types and Variables',
            description: 'Working with different data types in Solidity',
            videoUrl: 'https://example.com/data-types.mp4',
            duration: 18,
            order: 1,
            isFree: false,
          },
          {
            title: 'Functions and Modifiers',
            description: 'Creating functions and access control',
            videoUrl: 'https://example.com/functions.mp4',
            duration: 22,
            order: 2,
            isFree: false,
          },
          {
            title: 'Your First Contract',
            description: 'Deploy your first smart contract to testnet',
            videoUrl: 'https://example.com/first-contract.mp4',
            duration: 25,
            order: 3,
            isFree: false,
          },
        ],
      },
      test: {
        create: {
          title: 'Solidity Fundamentals Quiz',
          description: 'Test your understanding of Solidity basics. You need 70% to unlock the next section.',
          passingScore: 70,
          timeLimit: 15,
          questions: {
            create: [
              {
                question: 'Which keyword is used to declare a state variable that can be changed?',
                explanation: 'State variables without the "constant" or "immutable" keyword can be changed after deployment.',
                order: 0,
                points: 1,
                answers: {
                  create: [
                    { answer: 'var', isCorrect: false, order: 0 },
                    { answer: 'let', isCorrect: false, order: 1 },
                    { answer: 'No special keyword needed', isCorrect: true, order: 2 },
                    { answer: 'mutable', isCorrect: false, order: 3 },
                  ],
                },
              },
              {
                question: 'What is the visibility of a function that can only be called from within the contract?',
                explanation: 'Private functions can only be called from within the same contract, not from derived contracts or externally.',
                order: 1,
                points: 1,
                answers: {
                  create: [
                    { answer: 'public', isCorrect: false, order: 0 },
                    { answer: 'private', isCorrect: true, order: 1 },
                    { answer: 'internal', isCorrect: false, order: 2 },
                    { answer: 'external', isCorrect: false, order: 3 },
                  ],
                },
              },
              {
                question: 'Which of the following are valid Solidity data types? (Select all that apply)',
                explanation: 'Solidity supports uint (unsigned integer), address (Ethereum address), bool (boolean), and string types.',
                order: 2,
                points: 2,
                answers: {
                  create: [
                    { answer: 'uint', isCorrect: true, order: 0 },
                    { answer: 'address', isCorrect: true, order: 1 },
                    { answer: 'float', isCorrect: false, order: 2 },
                    { answer: 'bool', isCorrect: true, order: 3 },
                    { answer: 'string', isCorrect: true, order: 4 },
                  ],
                },
              },
              {
                question: 'What does the "payable" modifier do?',
                explanation: 'The payable modifier allows a function to receive Ether when called.',
                order: 3,
                points: 1,
                answers: {
                  create: [
                    { answer: 'Allows the function to receive Ether', isCorrect: true, order: 0 },
                    { answer: 'Makes the function public', isCorrect: false, order: 1 },
                    { answer: 'Prevents reentrancy attacks', isCorrect: false, order: 2 },
                    { answer: 'Reduces gas costs', isCorrect: false, order: 3 },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  })

  // Section 3: DApp Development (Requires test to unlock next)
  const section3 = await prisma.courseSection.create({
    data: {
      courseId: sectionCourse.id,
      title: 'Building Decentralized Applications',
      description: 'Connect your smart contracts to a React frontend',
      order: 2,
      requireTest: true,
      topics: {
        create: [
          {
            title: 'Web3.js vs Ethers.js',
            description: 'Choosing the right Web3 library',
            videoUrl: 'https://example.com/web3-libraries.mp4',
            duration: 15,
            order: 0,
            isFree: false,
          },
          {
            title: 'Connecting to MetaMask',
            description: 'Integrate MetaMask wallet into your app',
            videoUrl: 'https://example.com/metamask.mp4',
            duration: 20,
            order: 1,
            isFree: false,
          },
          {
            title: 'Reading Contract Data',
            description: 'Call view and pure functions from frontend',
            videoUrl: 'https://example.com/read-data.mp4',
            duration: 18,
            order: 2,
            isFree: false,
          },
          {
            title: 'Sending Transactions',
            description: 'Execute transactions and handle events',
            videoUrl: 'https://example.com/transactions.mp4',
            duration: 22,
            order: 3,
            isFree: false,
          },
        ],
      },
      test: {
        create: {
          title: 'DApp Development Quiz',
          description: 'Test your knowledge of Web3 frontend integration',
          passingScore: 70,
          timeLimit: 10,
          questions: {
            create: [
              {
                question: 'Which method is used to read data from a smart contract without spending gas?',
                explanation: 'View and pure functions can be called without creating a transaction, so no gas is required.',
                order: 0,
                points: 1,
                answers: {
                  create: [
                    { answer: 'contract.methods.myMethod().send()', isCorrect: false, order: 0 },
                    { answer: 'contract.methods.myMethod().call()', isCorrect: true, order: 1 },
                    { answer: 'contract.methods.myMethod().execute()', isCorrect: false, order: 2 },
                  ],
                },
              },
              {
                question: 'What does MetaMask provide to your DApp?',
                explanation: 'MetaMask acts as a Web3 provider and manages user accounts and transaction signing.',
                order: 1,
                points: 2,
                answers: {
                  create: [
                    { answer: 'Web3 provider', isCorrect: true, order: 0 },
                    { answer: 'User account management', isCorrect: true, order: 1 },
                    { answer: 'Transaction signing', isCorrect: true, order: 2 },
                    { answer: 'Smart contract deployment', isCorrect: false, order: 3 },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  })

  // Section 4: Final Project (No test required, it's the last section)
  const section4 = await prisma.courseSection.create({
    data: {
      courseId: sectionCourse.id,
      title: 'Build Your Portfolio Project',
      description: 'Create a complete DApp from scratch',
      order: 3,
      requireTest: false,
      topics: {
        create: [
          {
            title: 'Project Planning',
            description: 'Plan your DApp architecture and features',
            videoUrl: 'https://example.com/project-planning.mp4',
            duration: 15,
            order: 0,
            isFree: false,
          },
          {
            title: 'Smart Contract Development',
            description: 'Build and test your smart contracts',
            videoUrl: 'https://example.com/project-contracts.mp4',
            duration: 30,
            order: 1,
            isFree: false,
          },
          {
            title: 'Frontend Development',
            description: 'Create the user interface',
            videoUrl: 'https://example.com/project-frontend.mp4',
            duration: 35,
            order: 2,
            isFree: false,
          },
          {
            title: 'Deployment & Testing',
            description: 'Deploy to testnet and production',
            videoUrl: 'https://example.com/deployment.mp4',
            duration: 25,
            order: 3,
            isFree: false,
          },
        ],
      },
    },
  })

  console.log('✅ Section-based course with tests seeded')

  // Create services
  await prisma.service.deleteMany() // Clear existing services
  const services = [
    {
      title: 'Smart Contract Development',
      description: 'Custom smart contract development for your blockchain project.',
      icon: 'Code',
      features: ['ERC20, ERC721, ERC1155', 'DeFi protocols', 'DAO contracts', 'Security auditing'],
      price: 'Starting at $5,000',
      order: 1,
      active: true,
    },
    {
      title: 'DApp Development',
      description: 'Full-stack decentralized application development.',
      icon: 'Blocks',
      features: ['React/Next.js', 'Web3 integration', 'IPFS storage', 'Real-time data'],
      price: 'Starting at $10,000',
      order: 2,
      active: true,
    },
    {
      title: 'Smart Contract Auditing',
      description: 'Comprehensive security audits for your smart contracts.',
      icon: 'Shield',
      features: ['Code review', 'Vulnerability assessment', 'Gas optimization', 'Audit report'],
      price: 'Starting at $3,000',
      order: 3,
      active: true,
    },
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service,
    })
  }
  console.log('✅ Services seeded')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📧 Admin Login Credentials:')
  console.log('Email: admin@basantsd.com')
  console.log('Password: admin123')
  console.log('\n⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
