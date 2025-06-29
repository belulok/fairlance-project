const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FairLance Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

// Mock projects endpoint
app.get('/api/projects', (req, res) => {
  try {
    console.log('🚀 Projects endpoint called');
    // Enhanced Mock Projects Data - Production Ready
  const mockProjects = [
    {
      id: 1,
      title: "Build DeFi Dashboard with Advanced Analytics",
      description: "Create a comprehensive DeFi dashboard featuring real-time analytics, portfolio tracking, yield farming opportunities, and cross-chain asset management. The platform should support 10+ blockchains and integrate with major DeFi protocols like Uniswap, Aave, and Compound. Must include advanced charting, risk assessment tools, and automated rebalancing features.",
      budget: { min: 2500, max: 4000, currency: "USDC" },
      deadline: new Date(Date.now() + 1209600000), // 14 days from now
      category: "Development",
      skills: ["React", "Web3.js", "DeFi", "TypeScript", "Node.js", "GraphQL", "TradingView Charts"],
      client: {
        name: "DeFi Capital Partners",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4.9,
        reviews: 127,
        verified: true,
        memberSince: "2022-03-15",
        totalSpent: 45000,
        location: "Singapore",
        timezone: "GMT+8"
      },
      proposals: 34,
      featured: true,
      status: "open",
      urgency: "high",
      projectType: "fixed",
      estimatedHours: 120,
      tags: ["DeFi", "Analytics", "Multi-chain", "Enterprise"],
      attachments: ["requirements.pdf", "wireframes.figma"],
      postedDate: new Date(Date.now() - 172800000), // 2 days ago
      viewCount: 156
    },
    {
      id: 2,
      title: "Comprehensive Smart Contract Security Audit",
      description: "Conduct a thorough security audit for our NFT marketplace smart contracts including minting, trading, royalties, and governance mechanisms. Deliverables include detailed vulnerability assessment, gas optimization recommendations, and formal verification report. Experience with OpenZeppelin, Foundry, and Slither required.",
      budget: { min: 5000, max: 8000, currency: "USDC" },
      deadline: new Date(Date.now() + 1814400000), // 21 days from now
      category: "Security",
      skills: ["Solidity", "Security Auditing", "Smart Contracts", "Foundry", "Slither", "Formal Verification"],
      client: {
        name: "ArtBlock Studios",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        rating: 4.8,
        reviews: 89,
        verified: true,
        memberSince: "2021-11-20",
        totalSpent: 78000,
        location: "New York, USA",
        timezone: "GMT-5"
      },
      proposals: 18,
      featured: true,
      status: "open",
      urgency: "medium",
      projectType: "fixed",
      estimatedHours: 80,
      tags: ["Security", "NFT", "Audit", "High-Value"],
      attachments: ["contracts.zip", "architecture.md"],
      postedDate: new Date(Date.now() - 86400000), // 1 day ago
      viewCount: 203
    },
    {
      id: 3,
      title: "Web3 Social Media Mobile App UI/UX Design",
      description: "Design a revolutionary mobile application for decentralized social media platform with focus on user privacy, content monetization, and community governance. Need complete design system, user flows, prototypes, and developer handoff documentation. Should support dark/light themes and accessibility standards.",
      budget: { min: 3000, max: 4500, currency: "USDC" },
      deadline: new Date(Date.now() + 1728000000), // 20 days from now
      category: "Design",
      skills: ["UI/UX Design", "Mobile Design", "Figma", "Prototyping", "Design Systems", "Accessibility"],
      client: {
        name: "DecentralSocial DAO",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4.7,
        reviews: 56,
        verified: true,
        memberSince: "2022-07-10",
        totalSpent: 23000,
        location: "Berlin, Germany",
        timezone: "GMT+1"
      },
      proposals: 42,
      featured: true,
      status: "open",
      urgency: "medium",
      projectType: "fixed",
      estimatedHours: 100,
      tags: ["Social Media", "Mobile", "Web3", "Privacy"],
      attachments: ["brand_guidelines.pdf", "user_research.pdf"],
      postedDate: new Date(Date.now() - 259200000), // 3 days ago
      viewCount: 298
    },
    {
      id: 4,
      title: "Cross-Chain Bridge Development",
      description: "Develop a secure cross-chain bridge connecting Ethereum, Polygon, and Arbitrum networks. Must implement advanced security measures, multi-signature validation, and real-time monitoring. Experience with LayerZero or similar protocols preferred.",
      budget: { min: 8000, max: 12000, currency: "USDC" },
      deadline: new Date(Date.now() + 2592000000), // 30 days from now
      category: "Development",
      skills: ["Solidity", "Cross-chain", "LayerZero", "Security", "Node.js", "Monitoring"],
      client: {
        name: "MultiChain Labs",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        rating: 4.9,
        reviews: 234,
        verified: true,
        memberSince: "2021-05-12",
        totalSpent: 156000,
        location: "San Francisco, USA",
        timezone: "GMT-8"
      },
      proposals: 12,
      featured: true,
      status: "open",
      urgency: "high",
      projectType: "fixed",
      estimatedHours: 200,
      tags: ["Cross-chain", "Bridge", "Enterprise", "High-Value"],
      attachments: ["technical_spec.pdf", "security_requirements.md"],
      postedDate: new Date(Date.now() - 432000000), // 5 days ago
      viewCount: 445
    },
    {
      id: 5,
      title: "GameFi Token Economics Design",
      description: "Design comprehensive tokenomics for play-to-earn gaming platform including governance tokens, utility tokens, NFT mechanics, and sustainable reward systems. Must include economic modeling, inflation controls, and long-term sustainability analysis.",
      budget: { min: 4000, max: 6000, currency: "USDC" },
      deadline: new Date(Date.now() + 1555200000), // 18 days from now
      category: "Consulting",
      skills: ["Tokenomics", "Game Design", "Economics", "DeFi", "NFTs", "Modeling"],
      client: {
        name: "PlayChain Games",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4.6,
        reviews: 78,
        verified: true,
        memberSince: "2022-01-08",
        totalSpent: 34000,
        location: "Tokyo, Japan",
        timezone: "GMT+9"
      },
      proposals: 28,
      featured: false,
      status: "open",
      urgency: "medium",
      projectType: "fixed",
      estimatedHours: 60,
      tags: ["GameFi", "Tokenomics", "P2E", "Strategy"],
      attachments: ["game_overview.pdf", "current_model.xlsx"],
      postedDate: new Date(Date.now() - 345600000), // 4 days ago
      viewCount: 187
    },
    {
      id: 6,
      title: "AI-Powered Trading Bot Development",
      description: "Build an intelligent trading bot using machine learning algorithms for automated cryptocurrency trading. Must include risk management, backtesting capabilities, and integration with major exchanges. Experience with Python, TensorFlow, and trading APIs required.",
      budget: { min: 6000, max: 9000, currency: "USDC" },
      deadline: new Date(Date.now() + 2160000000), // 25 days from now
      category: "Development",
      skills: ["Python", "Machine Learning", "Trading APIs", "TensorFlow", "Risk Management", "Backtesting"],
      client: {
        name: "QuantTrade Capital",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
        rating: 4.8,
        reviews: 156,
        verified: true,
        memberSince: "2021-09-22",
        totalSpent: 89000,
        location: "London, UK",
        timezone: "GMT+0"
      },
      proposals: 23,
      featured: false,
      status: "open",
      urgency: "medium",
      projectType: "fixed",
      estimatedHours: 150,
      tags: ["AI", "Trading", "Fintech", "Automation"],
      attachments: ["strategy_doc.pdf", "api_requirements.md"],
      postedDate: new Date(Date.now() - 518400000), // 6 days ago
      viewCount: 312
    },
    {
      id: 7,
      title: "DAO Governance Platform Frontend",
      description: "Create a modern React frontend for DAO governance platform with proposal creation, voting mechanisms, treasury management, and member analytics. Must be responsive, accessible, and integrate with Web3 wallets. Design system and component library included.",
      budget: { min: 3500, max: 5000, currency: "USDC" },
      deadline: new Date(Date.now() + 1382400000), // 16 days from now
      category: "Development",
      skills: ["React", "TypeScript", "Web3", "UI/UX", "Responsive Design", "Accessibility"],
      client: {
        name: "GovDAO Foundation",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        rating: 4.7,
        reviews: 92,
        verified: true,
        memberSince: "2022-02-14",
        totalSpent: 67000,
        location: "Zurich, Switzerland",
        timezone: "GMT+1"
      },
      proposals: 38,
      featured: true,
      status: "open",
      urgency: "high",
      projectType: "fixed",
      estimatedHours: 90,
      tags: ["DAO", "Governance", "Frontend", "Web3"],
      attachments: ["mockups.figma", "requirements.pdf"],
      postedDate: new Date(Date.now() - 604800000), // 7 days ago
      viewCount: 421
    },
    {
      id: 8,
      title: "NFT Marketplace Smart Contract Optimization",
      description: "Optimize existing NFT marketplace smart contracts for gas efficiency and add new features including batch minting, royalty splits, and auction mechanisms. Must maintain security while reducing transaction costs by 40%+. Comprehensive testing required.",
      budget: { min: 4500, max: 7000, currency: "USDC" },
      deadline: new Date(Date.now() + 1296000000), // 15 days from now
      category: "Development",
      skills: ["Solidity", "Gas Optimization", "Smart Contracts", "Testing", "NFTs", "Auctions"],
      client: {
        name: "CryptoArt Collective",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        rating: 4.9,
        reviews: 203,
        verified: true,
        memberSince: "2021-06-30",
        totalSpent: 124000,
        location: "Miami, USA",
        timezone: "GMT-5"
      },
      proposals: 16,
      featured: true,
      status: "open",
      urgency: "high",
      projectType: "fixed",
      estimatedHours: 110,
      tags: ["NFT", "Optimization", "Smart Contracts", "Gas Efficiency"],
      attachments: ["current_contracts.zip", "optimization_goals.md"],
      postedDate: new Date(Date.now() - 691200000), // 8 days ago
      viewCount: 267
    }
  ];

  // Apply filters
  let filteredProjects = [...mockProjects];
  
  if (req.query.category && req.query.category !== 'all') {
    filteredProjects = filteredProjects.filter(p => 
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.skills.some(skill => skill.toLowerCase().includes(search))
    );
  }

  // Apply sorting
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'budget-high':
        filteredProjects.sort((a, b) => b.budget.max - a.budget.max);
        break;
      case 'budget-low':
        filteredProjects.sort((a, b) => a.budget.min - b.budget.min);
        break;
      case 'deadline':
        filteredProjects.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
        break;
      default: // newest
        filteredProjects.sort((a, b) => b.id - a.id);
    }
  }

  res.json({
    projects: filteredProjects,
    pagination: {
      page: 1,
      limit: 10,
      total: filteredProjects.length,
      pages: 1
    }
  });
  } catch (error) {
    console.error('Error in /api/projects:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Projects endpoint error', error: error.message, stack: error.stack });
  }
});

// Mock featured projects
app.get('/api/projects/featured', (req, res) => {
  const featuredProjects = [
    {
      id: 1,
      title: "Build DeFi Dashboard",
      description: "Create a modern DeFi dashboard with real-time analytics and portfolio tracking...",
      budget: "500 USDC",
      deadline: new Date(Date.now() + 172800000)
    },
    {
      id: 3,
      title: "Web3 Mobile App Design",
      description: "Design a modern mobile app for decentralized social media platform...",
      budget: "800 USDC",
      deadline: new Date(Date.now() + 345600000)
    }
  ];

  res.json({ projects: featuredProjects });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'User registered successfully',
    token: 'mock-jwt-token',
    user: {
      id: 'mock-user-id',
      email: req.body.email,
      username: req.body.username,
      userType: req.body.userType || 'both'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: 'mock-user-id',
      email: req.body.email,
      username: 'mockuser',
      userType: 'both'
    }
  });
});

// Mock KYC endpoints (no auth for demo)
app.post('/api/kyc/initiate', (req, res) => {
  res.json({
    message: 'KYC verification initiated',
    kycId: 'mock-kyc-' + Date.now(),
    verificationUrl: 'https://maschain.com/kyc/verify/mock-session'
  });
});

app.get('/api/kyc/status', (req, res) => {
  res.json({
    status: 'verified',
    data: {
      document_type: 'passport',
      document_number: 'A12345678',
      verification_date: new Date().toISOString()
    },
    trustScore: 85
  });
});

// Mock certificates endpoints (no auth for demo) - Enhanced with MasChain Trust NFTs
app.get('/api/certificates/my-nfts', (req, res) => {
  res.json({
    certificates: [
      {
        id: 'cert-1',
        type: 'TRUST_NFT',
        tokenId: '0x1a2b3c4d5e6f',
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
        metadata: {
          projectTitle: 'DeFi Dashboard Development',
          clientName: 'DeFi Capital Partners',
          rating: 5,
          trustPoints: 95,
          completionDate: '2024-06-15T00:00:00.000Z',
          projectValue: 3500,
          skills: ['React', 'Web3.js', 'DeFi', 'TypeScript'],
          deliverables: ['Frontend Dashboard', 'API Integration', 'Documentation'],
          verificationHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
        },
        masChainData: {
          issuer: 'FairLance Platform',
          verificationLevel: 'Enterprise',
          blockchainNetwork: 'MasChain Testnet',
          transactionHash: '0x8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a'
        }
      },
      {
        id: 'cert-2',
        type: 'TRUST_NFT',
        tokenId: '0x2b3c4d5e6f7a',
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
        metadata: {
          projectTitle: 'Smart Contract Security Audit',
          clientName: 'ArtBlock Studios',
          rating: 4.9,
          trustPoints: 120,
          completionDate: '2024-06-20T00:00:00.000Z',
          projectValue: 6500,
          skills: ['Solidity', 'Security', 'Auditing', 'Foundry'],
          deliverables: ['Security Report', 'Vulnerability Assessment', 'Gas Optimization'],
          verificationHash: 'QmXvBJzv8CZsnB625s4Yf3nemtZgQpIdWFz80pjXnQcdH'
        },
        masChainData: {
          issuer: 'FairLance Platform',
          verificationLevel: 'Enterprise',
          blockchainNetwork: 'MasChain Testnet',
          transactionHash: '0x9f3b2c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b1'
        }
      },
      {
        id: 'cert-3',
        type: 'TRUST_NFT',
        tokenId: '0x3c4d5e6f7a8b',
        contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
        metadata: {
          projectTitle: 'Cross-Chain Bridge Implementation',
          clientName: 'MultiChain Labs',
          rating: 4.8,
          trustPoints: 110,
          completionDate: '2024-05-28T00:00:00.000Z',
          projectValue: 10000,
          skills: ['Solidity', 'Cross-chain', 'LayerZero', 'Security'],
          deliverables: ['Bridge Contracts', 'Security Implementation', 'Monitoring System'],
          verificationHash: 'QmZwCPKzv9DZsnC625s5Zf4nemtAgRpJeXGz81qkYnRdeI'
        },
        masChainData: {
          issuer: 'FairLance Platform',
          verificationLevel: 'Enterprise',
          blockchainNetwork: 'MasChain Testnet',
          transactionHash: '0xa04c3d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0c2'
        }
      }
    ],
    totalCertificates: 3,
    totalTrustPoints: 325,
    averageRating: 4.9,
    verificationStatus: 'Verified by MasChain'
  });
});

// Mock skill tokens endpoints (no auth for demo) - Enhanced with MasChain Skill Tokens
app.get('/api/tokens/my-skills', (req, res) => {
  res.json({
    skillTokens: [
      {
        skill: 'React',
        level: 8,
        balance: 1250,
        tokenAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
        earnedFrom: ['DeFi Dashboard', 'DAO Frontend', 'Social Media App'],
        lastEarned: '2024-06-20T00:00:00.000Z',
        marketValue: 2.5, // USDC per token
        totalEarned: 1450,
        projectsCompleted: 12,
        averageRating: 4.8,
        masChainData: {
          tokenStandard: 'MRC-20',
          verificationLevel: 'Expert',
          issuer: 'FairLance Skill Registry',
          blockchainNetwork: 'MasChain Testnet'
        }
      },
      {
        skill: 'Solidity',
        level: 9,
        balance: 980,
        tokenAddress: '0x853e46Dd7645D1643036925b4c8E5C0db97',
        earnedFrom: ['Smart Contract Audit', 'Cross-Chain Bridge', 'NFT Marketplace'],
        lastEarned: '2024-06-18T00:00:00.000Z',
        marketValue: 4.2, // USDC per token
        totalEarned: 1180,
        projectsCompleted: 8,
        averageRating: 4.9,
        masChainData: {
          tokenStandard: 'MRC-20',
          verificationLevel: 'Expert',
          issuer: 'FairLance Skill Registry',
          blockchainNetwork: 'MasChain Testnet'
        }
      },
      {
        skill: 'Web3',
        level: 7,
        balance: 750,
        tokenAddress: '0x964f57Ee8756E1754147936c5d9F6F1ea98',
        earnedFrom: ['DeFi Dashboard', 'DAO Frontend', 'Trading Bot'],
        lastEarned: '2024-06-22T00:00:00.000Z',
        marketValue: 3.1, // USDC per token
        totalEarned: 890,
        projectsCompleted: 10,
        averageRating: 4.7,
        masChainData: {
          tokenStandard: 'MRC-20',
          verificationLevel: 'Advanced',
          issuer: 'FairLance Skill Registry',
          blockchainNetwork: 'MasChain Testnet'
        }
      },
      {
        skill: 'TypeScript',
        level: 6,
        balance: 620,
        tokenAddress: '0xa75g68Ff9867F2865258047d6eAG7G2fb09',
        earnedFrom: ['DeFi Dashboard', 'DAO Frontend'],
        lastEarned: '2024-06-19T00:00:00.000Z',
        marketValue: 2.8, // USDC per token
        totalEarned: 720,
        projectsCompleted: 6,
        averageRating: 4.6,
        masChainData: {
          tokenStandard: 'MRC-20',
          verificationLevel: 'Intermediate',
          issuer: 'FairLance Skill Registry',
          blockchainNetwork: 'MasChain Testnet'
        }
      },
      {
        skill: 'Security Auditing',
        level: 8,
        balance: 420,
        tokenAddress: '0xb86h79Gg0978G3976369158e7fBH8H3gc10',
        earnedFrom: ['Smart Contract Audit', 'NFT Marketplace Optimization'],
        lastEarned: '2024-06-16T00:00:00.000Z',
        marketValue: 5.5, // USDC per token
        totalEarned: 520,
        projectsCompleted: 4,
        averageRating: 4.9,
        masChainData: {
          tokenStandard: 'MRC-20',
          verificationLevel: 'Expert',
          issuer: 'FairLance Skill Registry',
          blockchainNetwork: 'MasChain Testnet'
        }
      }
    ],
    totalSkills: 5,
    totalTokenValue: 12847.5, // Total value in USDC
    skillLevels: {
      'React': 8,
      'Solidity': 9,
      'Web3': 7,
      'TypeScript': 6,
      'Security Auditing': 8
    },
    portfolioStats: {
      totalProjectsCompleted: 40,
      totalEarnings: 4760,
      averageProjectRating: 4.78,
      topSkill: 'Solidity',
      recentActivity: '2024-06-22T00:00:00.000Z'
    },
    masChainIntegration: {
      walletConnected: true,
      verificationStatus: 'Verified',
      skillRegistryContract: '0x742d35Cc6634C0532925a3b8D4C9db96',
      lastSync: '2024-06-29T05:49:35.070Z'
    }
  });
});

app.get('/api/tokens/skill-leaderboard/:skill', (req, res) => {
  const { skill } = req.params;
  res.json({
    skill,
    leaderboard: [
      {
        username: 'cryptodev',
        name: 'Alex Johnson',
        trustScore: 92,
        skillLevel: 10,
        tokenBalance: 1250
      },
      {
        username: 'blockchainpro',
        name: 'Sarah Chen',
        trustScore: 88,
        skillLevel: 9,
        tokenBalance: 980
      },
      {
        username: 'web3builder',
        name: 'Mike Rodriguez',
        trustScore: 85,
        skillLevel: 8,
        tokenBalance: 750
      }
    ],
    totalParticipants: 3
  });
});

// Mock proof-of-work endpoint
app.post('/api/proof-of-work/submit', (req, res) => {
  const { deliverableType, url, description } = req.body;

  // Generate mock hash based on input
  const mockHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';

  res.json({
    message: 'Proof of work submitted successfully',
    hash: mockHash,
    verificationStatus: 'verified',
    timestamp: new Date().toISOString(),
    deliverableType,
    originalUrl: url
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Cloud Run uses dynamic port assignment, fallback to 5001 for local dev
const PORT = process.env.PORT || 5001;
// Start server (bind to 0.0.0.0 for Cloud Run)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FairLance Backend (Simple) running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
