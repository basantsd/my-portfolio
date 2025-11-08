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
      description: 'A decentralized lending platform built on Ethereum with automated market-making and liquidity pools.',
      content: 'Full project description with technical details...',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      tags: ['Solidity', 'Ethereum', 'DeFi', 'React'],
      githubUrl: 'https://github.com/basantsd/defi-lending',
      liveUrl: 'https://defi-lending-demo.vercel.app',
      featured: true,
      status: 'COMPLETED',
      order: 1,
    },
    {
      title: 'NFT Marketplace',
      slug: 'nft-marketplace',
      description: 'Full-stack NFT marketplace with minting, trading, and royalty management features.',
      content: 'Complete NFT marketplace implementation...',
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&h=400&fit=crop',
      tags: ['Solidity', 'IPFS', 'Next.js', 'Web3'],
      githubUrl: 'https://github.com/basantsd/nft-marketplace',
      liveUrl: 'https://nft-marketplace-demo.vercel.app',
      featured: true,
      status: 'COMPLETED',
      order: 2,
    },
    {
      title: 'DAO Governance Platform',
      slug: 'dao-governance',
      description: 'Decentralized governance platform with proposal creation, voting, and treasury management.',
      content: 'DAO governance system with voting mechanisms...',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop',
      tags: ['Solidity', 'Hardhat', 'TypeScript', 'DAO'],
      githubUrl: 'https://github.com/basantsd/dao-governance',
      liveUrl: 'https://dao-platform-demo.vercel.app',
      featured: true,
      status: 'IN_PROGRESS',
      order: 3,
    },
    {
      title: 'Token Vesting Contract',
      slug: 'token-vesting',
      description: 'Secure token vesting smart contract with cliff periods and linear vesting.',
      content: 'Token vesting implementation with security features...',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop',
      tags: ['Solidity', 'Security', 'ERC-20', 'Foundry'],
      githubUrl: 'https://github.com/basantsd/token-vesting',
      liveUrl: '',
      featured: false,
      status: 'COMPLETED',
      order: 4,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }
  console.log('✅ Projects seeded')

  // Create blog posts
  const blogPosts = [
    {
      title: 'Getting Started with Solidity Smart Contracts',
      slug: 'getting-started-solidity',
      excerpt: 'Learn the fundamentals of Solidity and how to write your first smart contract on Ethereum.',
      content: '# Getting Started with Solidity\n\nSolidity is the most popular programming language for writing smart contracts...',
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
      tags: ['Solidity', 'Ethereum', 'Tutorial'],
      published: true,
      readTime: 8,
    },
    {
      title: 'DeFi Protocol Security: Best Practices',
      slug: 'defi-security-best-practices',
      excerpt: 'Essential security considerations when building DeFi protocols.',
      content: '# DeFi Security Best Practices\n\nSecurity is paramount in DeFi development...',
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
      tags: ['DeFi', 'Security', 'Best Practices'],
      published: true,
      readTime: 12,
    },
    {
      title: 'Building NFT Marketplaces: Complete Guide',
      slug: 'nft-marketplace-guide',
      excerpt: 'A comprehensive guide to building your own NFT marketplace.',
      content: '# Building NFT Marketplaces\n\nNFT marketplaces are complex applications...',
      coverImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop',
      tags: ['NFT', 'Marketplace', 'Guide'],
      published: true,
      readTime: 15,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }
  console.log('✅ Blog posts seeded')

  // Create courses
  const courses = [
    {
      title: 'Complete Solidity & Smart Contracts Course',
      slug: 'solidity-smart-contracts',
      description: 'Master Solidity development from basics to advanced concepts.',
      content: 'Complete course curriculum...',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      price: 99,
      isPremium: true,
      published: true,
      level: 'BEGINNER',
      duration: 1200,
    },
    {
      title: 'DeFi Development Masterclass',
      slug: 'defi-development',
      description: 'Build production-ready DeFi protocols.',
      content: 'Advanced DeFi course content...',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
      price: 149,
      isPremium: true,
      published: true,
      level: 'INTERMEDIATE',
      duration: 1800,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    })
  }
  console.log('✅ Courses seeded')

  // Create services
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

  console.log('🎉 Database seeded successfully!')
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
