const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fairlance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    email: 'alex.johnson@example.com',
    password: 'password123',
    username: 'cryptodev_alex',
    firstName: 'Alex',
    lastName: 'Johnson',
    bio: 'Senior Blockchain Developer with 5+ years experience in DeFi and smart contract development. Specialized in Solidity, React, and Web3 integration.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'Singapore',
    timezone: 'GMT+8',
    userType: 'freelancer',
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    masChainWalletId: 'mc_wallet_alex_001',
    masChainEntityId: 'mc_entity_alex_001',
    kycStatus: 'verified',
    kycId: 'kyc_alex_001',
    kycData: {
      documentType: 'passport',
      documentNumber: 'A12345678',
      verificationDate: new Date('2024-01-15'),
      expiryDate: new Date('2029-01-15')
    },
    skills: ['React', 'Solidity', 'Web3.js', 'DeFi', 'TypeScript', 'Node.js'],
    hourlyRate: 85,
    availability: 'part-time',
    portfolio: [
      {
        title: 'DeFi Yield Farming Protocol',
        description: 'Built a comprehensive yield farming protocol with automated strategies',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300',
        projectUrl: 'https://github.com/alexjohnson/defi-protocol',
        technologies: ['Solidity', 'React', 'Web3.js', 'Hardhat']
      }
    ],
    trustScore: 92,
    trustNFTs: [
      {
        certificateId: 'cert_alex_001',
        type: 'TRUST_NFT',
        issuedDate: new Date('2024-06-15'),
        metadata: {
          projectTitle: 'DeFi Dashboard Development',
          rating: 5,
          trustPoints: 95
        }
      }
    ],
    skillTokens: [
      {
        tokenAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
        skill: 'Solidity',
        level: 9,
        balance: 1250,
        earnedDate: new Date('2024-06-20')
      },
      {
        tokenAddress: '0x853e46Dd7645D1643036925b4c8E5C0db97',
        skill: 'React',
        level: 8,
        balance: 980,
        earnedDate: new Date('2024-06-18')
      }
    ],
    stats: {
      projectsCompleted: 34,
      totalEarnings: 125430,
      averageRating: 4.9,
      responseTime: 2.3,
      completionRate: 98
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date()
  },
  {
    email: 'sarah.chen@example.com',
    password: 'password123',
    username: 'sarah_blockchain',
    firstName: 'Sarah',
    lastName: 'Chen',
    bio: 'Full-Stack Web3 Developer specializing in frontend development and user experience for decentralized applications.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    location: 'Toronto, Canada',
    timezone: 'GMT-5',
    userType: 'freelancer',
    walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    masChainWalletId: 'mc_wallet_sarah_001',
    masChainEntityId: 'mc_entity_sarah_001',
    kycStatus: 'verified',
    kycId: 'kyc_sarah_001',
    skills: ['React', 'TypeScript', 'UI/UX Design', 'Web3.js', 'Next.js'],
    hourlyRate: 75,
    availability: 'full-time',
    trustScore: 88,
    stats: {
      projectsCompleted: 28,
      totalEarnings: 98000,
      averageRating: 4.8,
      responseTime: 1.8,
      completionRate: 95
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date()
  },
  {
    email: 'client@deficapital.com',
    password: 'password123',
    username: 'deficapital_client',
    firstName: 'Jennifer',
    lastName: 'Liu',
    bio: 'Leading DeFi investment firm focused on yield optimization and cross-chain protocols.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    location: 'Singapore',
    timezone: 'GMT+8',
    userType: 'client',
    walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    masChainWalletId: 'mc_wallet_client_001',
    masChainEntityId: 'mc_entity_client_001',
    kycStatus: 'verified',
    kycId: 'kyc_client_001',
    trustScore: 95,
    stats: {
      projectsCompleted: 0,
      totalEarnings: 0,
      averageRating: 4.9,
      responseTime: 0,
      completionRate: 0
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date()
  }
];

// Sample projects data
const sampleProjects = [
  {
    title: 'Build DeFi Dashboard with Advanced Analytics',
    description: 'Create a comprehensive DeFi dashboard featuring real-time analytics, portfolio tracking, yield farming opportunities, and cross-chain asset management. The platform should support 10+ blockchains and integrate with major DeFi protocols like Uniswap, Aave, and Compound.',
    category: 'development',
    skills: ['React', 'Web3.js', 'DeFi', 'TypeScript', 'Node.js', 'GraphQL'],
    budget: {
      min: 2500,
      max: 4000,
      currency: 'USDC'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 1209600000), // 14 days
      estimatedHours: 120
    },
    status: 'open',
    milestones: [
      {
        title: 'Frontend Development',
        description: 'Build responsive React dashboard',
        amount: 1500,
        dueDate: new Date(Date.now() + 604800000), // 7 days
        status: 'pending'
      },
      {
        title: 'Backend Integration',
        description: 'API integration and data processing',
        amount: 1500,
        dueDate: new Date(Date.now() + 1209600000), // 14 days
        status: 'pending'
      },
      {
        title: 'Testing & Deployment',
        description: 'Comprehensive testing and deployment',
        amount: 1000,
        dueDate: new Date(Date.now() + 1209600000), // 14 days
        status: 'pending'
      }
    ],
    requirements: {
      experienceLevel: 'expert',
      kycRequired: true,
      minimumTrustScore: 80,
      languageRequirements: ['English']
    },
    tags: ['DeFi', 'Analytics', 'Multi-chain', 'Enterprise'],
    featured: true,
    urgent: true,
    remote: true,
    views: 156,
    publishedAt: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    title: 'Smart Contract Security Audit',
    description: 'Conduct a thorough security audit for our NFT marketplace smart contracts including minting, trading, royalties, and governance mechanisms.',
    category: 'security',
    skills: ['Solidity', 'Security Auditing', 'Smart Contracts', 'Foundry', 'Slither'],
    budget: {
      min: 5000,
      max: 8000,
      currency: 'USDC'
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 1814400000), // 21 days
      estimatedHours: 80
    },
    status: 'open',
    milestones: [
      {
        title: 'Initial Assessment',
        description: 'Code review and vulnerability assessment',
        amount: 3000,
        dueDate: new Date(Date.now() + 604800000), // 7 days
        status: 'pending'
      },
      {
        title: 'Detailed Audit',
        description: 'Comprehensive security audit',
        amount: 3000,
        dueDate: new Date(Date.now() + 1209600000), // 14 days
        status: 'pending'
      },
      {
        title: 'Final Report',
        description: 'Detailed report with recommendations',
        amount: 2000,
        dueDate: new Date(Date.now() + 1814400000), // 21 days
        status: 'pending'
      }
    ],
    requirements: {
      experienceLevel: 'expert',
      kycRequired: true,
      minimumTrustScore: 90,
      languageRequirements: ['English']
    },
    tags: ['Security', 'NFT', 'Audit', 'High-Value'],
    featured: true,
    urgent: false,
    remote: true,
    views: 203,
    publishedAt: new Date(Date.now() - 86400000) // 1 day ago
  }
];

// Seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Proposal.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create projects and assign client IDs
    const createdProjects = [];
    for (let i = 0; i < sampleProjects.length; i++) {
      const projectData = sampleProjects[i];
      // Assign client (last user is a client)
      projectData.clientId = createdUsers[createdUsers.length - 1]._id;
      
      const project = new Project(projectData);
      await project.save();
      createdProjects.push(project);
      console.log(`📋 Created project: ${project.title}`);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${createdProjects.length} projects`);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if called directly
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase, connectDB };
