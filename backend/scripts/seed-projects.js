const mongoose = require('mongoose');
const Project = require('../src/models/Project');
const User = require('../src/models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProjects = [
  {
    title: "Build a DeFi Trading Dashboard",
    description: "We need an experienced React developer to build a comprehensive DeFi trading dashboard that integrates with multiple DEXs and provides real-time analytics. The dashboard should include portfolio tracking, yield farming opportunities, and advanced charting capabilities.",
    category: "development",
    skills: ["React", "TypeScript", "Web3.js", "DeFi", "Chart.js", "TailwindCSS"],
    budget: {
      min: 5000,
      max: 8000,
      currency: "USDC"
    },
    timeline: {
      estimatedHours: 120
    },
    status: "open",
    milestones: [
      {
        title: "UI/UX Design & Setup",
        description: "Create responsive design and project setup",
        amount: 2000,
        status: "pending"
      },
      {
        title: "DEX Integration",
        description: "Integrate with Uniswap, SushiSwap, and PancakeSwap",
        amount: 3000,
        status: "pending"
      },
      {
        title: "Analytics & Testing",
        description: "Implement analytics dashboard and comprehensive testing",
        amount: 3000,
        status: "pending"
      }
    ],
    requirements: {
      experienceLevel: "expert",
      kycRequired: true,
      minimumTrustScore: 85
    },
    tags: ["DeFi", "React", "Web3", "Trading", "Analytics"],
    featured: true,
    remote: true,
    urgent: false
  },
  {
    title: "Smart Contract Audit for NFT Marketplace",
    description: "Looking for a blockchain security expert to conduct a comprehensive audit of our NFT marketplace smart contracts. The contracts handle minting, trading, royalties, and escrow functionality. Must provide detailed report with recommendations.",
    category: "security",
    skills: ["Solidity", "Smart Contract Audit", "Security", "NFT", "OpenZeppelin"],
    budget: {
      min: 3000,
      max: 5000,
      currency: "USDC"
    },
    timeline: {
      estimatedHours: 80
    },
    status: "open",
    milestones: [
      {
        title: "Initial Code Review",
        description: "Review smart contract code and identify potential issues",
        amount: 1500,
        status: "pending"
      },
      {
        title: "Security Testing",
        description: "Conduct comprehensive security testing and vulnerability assessment",
        amount: 2000,
        status: "pending"
      },
      {
        title: "Final Report",
        description: "Deliver detailed audit report with recommendations",
        amount: 1500,
        status: "pending"
      }
    ],
    requirements: {
      experienceLevel: "expert",
      kycRequired: true,
      minimumTrustScore: 90
    },
    tags: ["Security", "Audit", "NFT", "Smart Contracts", "Solidity"],
    featured: true,
    remote: true,
    urgent: true
  },
  {
    title: "Mobile App UI/UX Design for Crypto Wallet",
    description: "We're building a next-generation crypto wallet and need a talented UI/UX designer to create an intuitive and beautiful mobile app interface. The design should focus on simplicity, security, and user experience for both beginners and advanced users.",
    category: "design",
    skills: ["UI/UX Design", "Mobile Design", "Figma", "Crypto", "User Research"],
    budget: {
      min: 2500,
      max: 4000,
      currency: "USDC"
    },
    timeline: {
      estimatedHours: 60
    },
    status: "open",
    milestones: [
      {
        title: "User Research & Wireframes",
        description: "Conduct user research and create initial wireframes",
        amount: 1200,
        status: "pending"
      },
      {
        title: "High-Fidelity Designs",
        description: "Create detailed UI designs for all app screens",
        amount: 1800,
        status: "pending"
      },
      {
        title: "Prototype & Handoff",
        description: "Create interactive prototype and developer handoff",
        amount: 1000,
        status: "pending"
      }
    ],
    requirements: {
      experienceLevel: "intermediate",
      kycRequired: false,
      minimumTrustScore: 70
    },
    tags: ["UI/UX", "Mobile", "Crypto", "Wallet", "Design"],
    featured: false,
    remote: true,
    urgent: false
  },
  {
    title: "Content Marketing Strategy for DeFi Protocol",
    description: "Seeking an experienced crypto content marketer to develop and execute a comprehensive marketing strategy for our new DeFi protocol. This includes blog posts, social media content, community management, and influencer outreach.",
    category: "marketing",
    skills: ["Content Marketing", "DeFi", "Social Media", "Community Management", "SEO"],
    budget: {
      min: 3000,
      max: 6000,
      currency: "USDC"
    },
    timeline: {
      estimatedHours: 100
    },
    status: "open",
    milestones: [
      {
        title: "Strategy Development",
        description: "Create comprehensive marketing strategy and content calendar",
        amount: 1500,
        status: "pending"
      },
      {
        title: "Content Creation",
        description: "Produce blog posts, social media content, and marketing materials",
        amount: 2500,
        status: "pending"
      },
      {
        title: "Campaign Execution",
        description: "Execute marketing campaigns and community engagement",
        amount: 2000,
        status: "pending"
      }
    ],
    requirements: {
      experienceLevel: "intermediate",
      kycRequired: false,
      minimumTrustScore: 75
    },
    tags: ["Marketing", "DeFi", "Content", "Social Media", "Community"],
    featured: false,
    remote: true,
    urgent: false
  },
  {
    title: "Technical Documentation for Blockchain API",
    description: "We need a technical writer with blockchain experience to create comprehensive documentation for our new blockchain API. This includes API reference, integration guides, code examples, and developer tutorials.",
    category: "writing",
    skills: ["Technical Writing", "API Documentation", "Blockchain", "Developer Docs"],
    budget: {
      min: 1500,
      max: 3000,
      currency: "USDC"
    },
    timeline: {
      estimatedHours: 50
    },
    status: "open",
    milestones: [
      {
        title: "API Reference Documentation",
        description: "Create detailed API reference with all endpoints",
        amount: 1000,
        status: "pending"
      },
      {
        title: "Integration Guides",
        description: "Write step-by-step integration guides and tutorials",
        amount: 1000,
        status: "pending"
      },
      {
        title: "Code Examples & Review",
        description: "Create code examples and final documentation review",
        amount: 1000,
        status: "pending"
      }
    ],
    requirements: {
      experienceLevel: "intermediate",
      kycRequired: false,
      minimumTrustScore: 60
    },
    tags: ["Technical Writing", "Documentation", "API", "Blockchain"],
    featured: false,
    remote: true,
    urgent: false
  }
];

async function seedProjects() {
  try {
    console.log('🌱 Starting project seeding...');

    // First, let's create a sample client user if none exists
    let clientUser = await User.findOne({ userType: 'client' });
    
    if (!clientUser) {
      console.log('📝 Creating sample client user...');
      clientUser = new User({
        username: 'sample_client',
        email: 'client@fairlance.demo',
        password: 'demo123456', // This will be hashed by the User model
        firstName: 'Demo',
        lastName: 'Client',
        userType: 'client',
        isVerified: true,
        kycStatus: 'verified',
        trustScore: 95,
        walletAddress: '0x1234567890123456789012345678901234567890'
      });
      await clientUser.save();
      console.log('✅ Sample client user created');
    }

    // Clear existing projects (optional - remove this if you want to keep existing projects)
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Create sample projects
    for (let i = 0; i < sampleProjects.length; i++) {
      const projectData = {
        ...sampleProjects[i],
        clientId: clientUser._id,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 100) + 10 // Random view count
      };

      const project = new Project(projectData);
      await project.save();
      console.log(`✅ Created project: ${project.title}`);
    }

    console.log('🎉 Successfully seeded 5 sample projects!');
    console.log('📊 Projects created:');
    sampleProjects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (${project.category})`);
    });

  } catch (error) {
    console.error('❌ Error seeding projects:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedProjects();
