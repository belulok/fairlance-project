const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

// Enhanced Database Simulation with CRUD operations and persistence
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'fairlance_database.json');

let mockDatabase = {
  users: [],
  projects: [],
  proposals: [],
  initialized: false
};

// Load database from file
const loadDatabase = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const savedData = JSON.parse(data);
      mockDatabase = { ...mockDatabase, ...savedData, initialized: true };

      // Fix any unrealistic rating values in loaded data
      mockDatabase.users.forEach(user => {
        if (user.stats && user.stats.averageRating) {
          user.stats.averageRating = Math.round(user.stats.averageRating * 10) / 10;
          user.stats.responseTime = Math.round(user.stats.responseTime * 10) / 10;
        }
      });

      console.log('📂 Database loaded from file');
      console.log(`   - Users: ${mockDatabase.users.length}`);
      console.log(`   - Projects: ${mockDatabase.projects.length}`);
      console.log(`   - Proposals: ${mockDatabase.proposals.length}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to load database:', error.message);
  }
  return false;
};

// Save database to file
const saveDatabase = () => {
  try {
    const dataToSave = {
      users: mockDatabase.users,
      projects: mockDatabase.projects,
      proposals: mockDatabase.proposals,
      initialized: true,
      lastSaved: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2));
    console.log('💾 Database saved to file');
  } catch (error) {
    console.error('❌ Failed to save database:', error.message);
  }
};

// Auto-save every 30 seconds
setInterval(() => {
  if (mockDatabase.initialized) {
    saveDatabase();
  }
}, 30000);

// Authentication middleware with auto-registration
const requireAuth = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];
  const signature = req.headers['x-wallet-signature'];

  if (!walletAddress) {
    return res.status(401).json({
      message: 'Wallet address required. Please connect your wallet.'
    });
  }

  // In production, verify the signature here
  // For demo, we'll check if user exists
  initializeDatabase();
  let user = mockDatabase.users.find(u =>
    u.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
  );

  if (!user) {
    // Auto-register new wallet users
    user = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      walletAddress: walletAddress,
      userType: 'freelancer', // Default to freelancer, can be changed later
      firstName: 'New',
      lastName: 'User',
      email: `${walletAddress.substring(0, 8)}@wallet.user`,
      bio: 'New user - please update your profile',
      location: 'Not specified',
      hourlyRate: 50,
      skills: [],
      kycStatus: 'pending',
      trustScore: 50,
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      lastLogin: new Date(),
      stats: {
        projectsCompleted: 0,
        totalEarnings: 0,
        averageRating: 0,
        responseTime: 0,
        completionRate: 0
      }
    };

    mockDatabase.users.push(user);
    saveDatabase();

    console.log(`🚀 Auto-registered new wallet user: ${walletAddress.substring(0, 10)}...`);
  }

  req.user = user;
  next();
};

// Optional auth middleware (allows both authenticated and guest access)
const optionalAuth = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];

  if (walletAddress) {
    initializeDatabase();
    const user = mockDatabase.users.find(u =>
      u.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    );
    req.user = user;
  }

  next();
};

// Generate comprehensive dummy data
const generateUsers = () => {
  const firstNames = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Maria', 'Chris', 'Anna', 'James', 'Sophie', 'Ryan', 'Kate', 'Tom', 'Nina', 'Ben', 'Zoe', 'Sam', 'Lily', 'Max', 'Eva', 'Luke', 'Mia', 'Jake', 'Aria', 'Noah', 'Chloe', 'Owen', 'Ruby', 'Leo', 'Grace', 'Finn', 'Ivy', 'Cole', 'Maya', 'Jude', 'Nora', 'Dean', 'Ella', 'Seth', 'Ava', 'Kai', 'Zara', 'Rex', 'Luna', 'Ace', 'Iris', 'Fox', 'Rose'];
  const lastNames = ['Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Brown', 'Davis', 'Miller', 'Garcia', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore', 'Young', 'Allen', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy'];
  const skills = ['React', 'Solidity', 'Web3.js', 'DeFi', 'TypeScript', 'Node.js', 'Python', 'Rust', 'Go', 'Smart Contracts', 'UI/UX Design', 'Figma', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'AI', 'Blockchain', 'NFTs', 'GameFi', 'Cross-chain', 'Security Auditing', 'DevOps', 'Mobile Development', 'Flutter', 'React Native', 'Vue.js', 'Angular', 'Next.js', 'Hardhat', 'Foundry', 'Ethers.js', 'IPFS', 'Chainlink', 'The Graph', 'Polygon', 'Arbitrum'];
  const locations = ['Singapore', 'New York, USA', 'London, UK', 'Toronto, Canada', 'Berlin, Germany', 'Tokyo, Japan', 'Sydney, Australia', 'Dubai, UAE', 'Hong Kong', 'Seoul, South Korea', 'Mumbai, India', 'São Paulo, Brazil', 'Mexico City, Mexico', 'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Zurich, Switzerland', 'Tel Aviv, Israel', 'Barcelona, Spain', 'Paris, France', 'Milan, Italy'];

  const users = [];

  // Generate 120 users (80 freelancers + 40 clients)
  for (let i = 0; i < 120; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const isFreelancer = i < 80; // First 80 are freelancers
    const userSkills = [];

    // Generate 3-8 random skills for freelancers
    if (isFreelancer) {
      const numSkills = 3 + Math.floor(Math.random() * 6);
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numSkills; j++) {
        userSkills.push(shuffledSkills[j]);
      }
    }

    const user = {
      id: `user_${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`,
      firstName,
      lastName,
      bio: isFreelancer
        ? `${userSkills.slice(0, 3).join(', ')} specialist with ${2 + Math.floor(Math.random() * 8)}+ years experience in blockchain development.`
        : `${firstName} ${lastName} represents a leading technology company focused on blockchain innovation and digital transformation.`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150`,
      location: locations[Math.floor(Math.random() * locations.length)],
      userType: isFreelancer ? 'freelancer' : 'client',
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      kycStatus: Math.random() > 0.1 ? 'verified' : 'pending',
      skills: userSkills,
      hourlyRate: isFreelancer ? 25 + Math.floor(Math.random() * 150) : 0,
      trustScore: 60 + Math.floor(Math.random() * 40),
      stats: {
        projectsCompleted: Math.floor(Math.random() * 50),
        totalEarnings: Math.floor(Math.random() * 200000),
        averageRating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // Round to 1 decimal
        responseTime: Math.round((0.5 + Math.random() * 4) * 10) / 10, // Round to 1 decimal
        completionRate: 85 + Math.floor(Math.random() * 15)
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
    };

    users.push(user);
  }

  return users;
};

const generateProjects = (users) => {
  const projectTitles = [
    'Build DeFi Dashboard with Advanced Analytics',
    'Smart Contract Security Audit for NFT Marketplace',
    'Cross-Chain Bridge Development',
    'GameFi Token Economics Design',
    'Web3 Social Media Platform',
    'Decentralized Exchange Frontend',
    'DAO Governance Portal',
    'NFT Minting Platform',
    'Yield Farming Protocol',
    'Crypto Payment Gateway',
    'Blockchain Voting System',
    'DeFi Lending Platform',
    'Metaverse Virtual World',
    'AI-Powered Trading Bot',
    'Decentralized Identity System',
    'Carbon Credit Marketplace',
    'Supply Chain Tracking DApp',
    'Decentralized Cloud Storage',
    'Crypto Portfolio Tracker',
    'Blockchain-Based Escrow',
    'DeFi Insurance Protocol',
    'NFT Marketplace with Royalties',
    'Staking Rewards Platform',
    'Decentralized Freelance Platform',
    'Crypto Derivatives Exchange',
    'Blockchain Gaming Platform',
    'DeFi Aggregator Interface',
    'Tokenized Real Estate Platform',
    'Decentralized News Platform',
    'Crypto Tax Calculator',
    'Blockchain Analytics Dashboard',
    'DeFi Yield Optimizer',
    'NFT Fractionalization Platform',
    'Decentralized Prediction Market',
    'Crypto Lending Pool',
    'Blockchain-Based Lottery',
    'DeFi Options Trading',
    'Decentralized Music Platform',
    'Crypto Wallet Interface',
    'Blockchain Supply Chain'
  ];

  const categories = ['Development', 'Security', 'Design', 'Consulting', 'Marketing', 'Writing'];
  const skills = ['React', 'Solidity', 'Web3.js', 'DeFi', 'TypeScript', 'Node.js', 'Python', 'Rust', 'Go', 'Smart Contracts', 'UI/UX Design', 'Figma', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'];

  const clients = users.filter(u => u.userType === 'client');
  const projects = [];

  // Generate 150 projects
  for (let i = 0; i < 150; i++) {
    const title = projectTitles[i % projectTitles.length] + (i >= projectTitles.length ? ` v${Math.floor(i / projectTitles.length) + 1}` : '');
    const category = categories[Math.floor(Math.random() * categories.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const projectSkills = [];

    // Generate 3-6 random skills
    const numSkills = 3 + Math.floor(Math.random() * 4);
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numSkills; j++) {
      projectSkills.push(shuffledSkills[j]);
    }

    const minBudget = 500 + Math.floor(Math.random() * 9500);
    const maxBudget = minBudget + 500 + Math.floor(Math.random() * 5000);

    const project = {
      id: i + 1,
      title,
      description: `Comprehensive ${category.toLowerCase()} project requiring expertise in ${projectSkills.slice(0, 3).join(', ')}. This project involves building scalable solutions with modern technologies and best practices.`,
      budget: {
        min: minBudget,
        max: maxBudget,
        currency: "USDC"
      },
      deadline: new Date(Date.now() + (7 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000),
      category,
      skills: projectSkills,
      client: {
        name: `${client.firstName} ${client.lastName}`,
        avatar: client.avatar,
        rating: client.stats.averageRating,
        reviews: client.stats.projectsCompleted,
        verified: client.kycStatus === 'verified'
      },
      clientId: client.id,
      proposals: Math.floor(Math.random() * 50),
      featured: Math.random() > 0.7,
      status: Math.random() > 0.2 ? 'open' : (Math.random() > 0.5 ? 'in-progress' : 'completed'),
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      viewCount: Math.floor(Math.random() * 500)
    };

    projects.push(project);
  }

  return projects;
};

const generateProposals = (users, projects) => {
  const freelancers = users.filter(u => u.userType === 'freelancer');
  const proposals = [];

  // Generate 200 proposals
  for (let i = 0; i < 200; i++) {
    const freelancer = freelancers[Math.floor(Math.random() * freelancers.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const proposedBudget = project.budget.min + Math.floor(Math.random() * (project.budget.max - project.budget.min));

    const statuses = ['pending', 'accepted', 'rejected'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const proposal = {
      id: `proposal_${i + 1}`,
      projectId: project.id,
      freelancerId: freelancer.id,
      status,
      proposedBudget,
      proposedTimeline: `${7 + Math.floor(Math.random() * 21)} days`,
      coverLetter: `I have extensive experience in ${freelancer.skills.slice(0, 3).join(', ')} and would be perfect for this project. My portfolio includes similar work with excellent client satisfaction.`,
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
      views: Math.floor(Math.random() * 30),
      messages: Math.floor(Math.random() * 10)
    };

    if (status === 'accepted') {
      proposal.acceptedAt = new Date(proposal.submittedAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    } else if (status === 'rejected') {
      proposal.rejectedAt = new Date(proposal.submittedAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      proposal.rejectionReason = 'Client chose a different freelancer';
    }

    proposals.push(proposal);
  }

  return proposals;
};

// Initialize mock database
const initializeDatabase = () => {
  if (mockDatabase.initialized) return;

  // Try to load from file first
  if (loadDatabase()) {
    return;
  }

  console.log('🚀 Initializing comprehensive mock database with 100+ entries each...');

  // Generate comprehensive data
  mockDatabase.users = generateUsers();
  console.log(`✅ Generated ${mockDatabase.users.length} users (${mockDatabase.users.filter(u => u.userType === 'freelancer').length} freelancers, ${mockDatabase.users.filter(u => u.userType === 'client').length} clients)`);

  mockDatabase.projects = generateProjects(mockDatabase.users);
  console.log(`✅ Generated ${mockDatabase.projects.length} projects`);

  mockDatabase.proposals = generateProposals(mockDatabase.users, mockDatabase.projects);
  console.log(`✅ Generated ${mockDatabase.proposals.length} proposals`);

  mockDatabase.initialized = true;

  // Save to file
  saveDatabase();

  console.log('✅ Mock database initialized with comprehensive data');
};

// CRUD Operations for Users
app.get('/api/users', (req, res) => {
  initializeDatabase();
  const { type, search } = req.query;

  let users = [...mockDatabase.users];

  if (type && type !== 'all') {
    users = users.filter(user => user.userType === type);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }

  res.json({
    users: users.map(user => {
      const { password, ...publicUser } = user;
      return publicUser;
    }),
    total: users.length,
    pagination: {
      page: 1,
      limit: 20,
      total: users.length,
      pages: 1
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  initializeDatabase();
  const user = mockDatabase.users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...publicUser } = user;
  res.json(publicUser);
});

app.post('/api/users', (req, res) => {
  initializeDatabase();

  // Check if user already exists
  const existingUser = mockDatabase.users.find(u =>
    u.email === req.body.email || u.walletAddress === req.body.walletAddress
  );

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists with this email or wallet address'
    });
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    ...req.body,
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true,
    isVerified: req.body.kycStatus === 'verified'
  };

  mockDatabase.users.push(newUser);

  // Save to persistent storage
  saveDatabase();

  const { password, ...publicUser } = newUser;

  console.log(`🚀 New user registered: ${newUser.firstName} ${newUser.lastName} (${newUser.userType})`);

  res.status(201).json(publicUser);
});

// CRUD Operations for Proposals
app.get('/api/proposals', (req, res) => {
  initializeDatabase();
  const { userId, projectId, status } = req.query;

  let proposals = [...mockDatabase.proposals];

  if (userId) {
    proposals = proposals.filter(p => p.freelancerId === userId);
  }

  if (projectId) {
    proposals = proposals.filter(p => p.projectId === parseInt(projectId));
  }

  if (status && status !== 'all') {
    proposals = proposals.filter(p => p.status === status);
  }

  // Populate with user and project data
  proposals = proposals.map(proposal => {
    const freelancer = mockDatabase.users.find(u => u.id === proposal.freelancerId);
    const project = mockDatabase.projects.find(p => p.id === proposal.projectId);

    return {
      ...proposal,
      freelancer: freelancer ? {
        id: freelancer.id,
        firstName: freelancer.firstName,
        lastName: freelancer.lastName,
        avatar: freelancer.avatar,
        trustScore: freelancer.trustScore,
        skills: freelancer.skills
      } : null,
      project: project ? {
        id: project.id,
        title: project.title,
        budget: project.budget
      } : null
    };
  });

  res.json({
    proposals,
    total: proposals.length,
    pagination: {
      page: 1,
      limit: 20,
      total: proposals.length,
      pages: 1
    }
  });
});

app.post('/api/proposals', requireAuth, (req, res) => {
  initializeDatabase();

  // Validate user is a freelancer
  if (req.user.userType !== 'freelancer') {
    return res.status(403).json({
      message: 'Only freelancers can submit proposals'
    });
  }

  // Validate required fields
  const { projectId, proposedBudget, proposedTimeline, coverLetter } = req.body;

  if (!projectId || !proposedBudget || !proposedTimeline || !coverLetter) {
    return res.status(400).json({
      message: 'Missing required fields: projectId, proposedBudget, proposedTimeline, coverLetter'
    });
  }

  // Check if project exists
  const project = mockDatabase.projects.find(p => p.id === parseInt(projectId));
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user already submitted a proposal for this project
  const existingProposal = mockDatabase.proposals.find(p =>
    p.projectId === parseInt(projectId) && p.freelancerId === req.user.id
  );

  if (existingProposal) {
    return res.status(400).json({
      message: 'You have already submitted a proposal for this project'
    });
  }

  const newProposal = {
    id: 'proposal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    projectId: parseInt(projectId),
    freelancerId: req.user.id,
    proposedBudget: parseFloat(proposedBudget),
    proposedTimeline,
    coverLetter,
    status: 'pending',
    submittedAt: new Date(),
    views: 0,
    messages: 0
  };

  mockDatabase.proposals.push(newProposal);

  // Save to persistent storage
  saveDatabase();

  console.log(`🚀 New proposal submitted by ${req.user.firstName} ${req.user.lastName} for project ${newProposal.projectId}`);

  res.status(201).json(newProposal);
});

// Enhanced projects endpoint with production-ready data
app.get('/api/projects', (req, res) => {
  initializeDatabase();
  let projects = [...mockDatabase.projects];

  // Apply filters
  if (req.query.category && req.query.category !== 'all') {
    projects = projects.filter(p =>
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  if (req.query.featured === 'true') {
    projects = projects.filter(p => p.featured === true);
  }

  if (req.query.status && req.query.status !== 'all') {
    projects = projects.filter(p => p.status === req.query.status);
  }

  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.skills.some(skill => skill.toLowerCase().includes(search))
    );
  }

  // Apply sorting
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'newest':
        projects.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'oldest':
        projects.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
        break;
      case 'budget-high':
        projects.sort((a, b) => b.budget.max - a.budget.max);
        break;
      case 'budget-low':
        projects.sort((a, b) => a.budget.min - b.budget.min);
        break;
      case 'popular':
        projects.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }
  }

  // Apply pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const totalProjects = projects.length;
  const totalPages = Math.ceil(totalProjects / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProjects = projects.slice(startIndex, endIndex);

  res.json({
    projects: paginatedProjects,
    total: totalProjects,
    pagination: {
      page: page,
      limit: limit,
      total: totalProjects,
      pages: totalPages
    }
  });
});

// Individual project endpoint
app.get('/api/projects/:id', (req, res) => {
  initializeDatabase();
  const projectId = parseInt(req.params.id);
  const project = mockDatabase.projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Increment view count
  project.viewCount = (project.viewCount || 0) + 1;

  res.json(project);
});

// Create new project
app.post('/api/projects', (req, res) => {
  initializeDatabase();
  const newProject = {
    id: mockDatabase.projects.length + 1,
    ...req.body,
    status: 'open',
    proposals: 0,
    featured: false,
    postedDate: new Date(),
    viewCount: 0
  };

  mockDatabase.projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  initializeDatabase();
  const projectId = parseInt(req.params.id);
  const projectIndex = mockDatabase.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  mockDatabase.projects[projectIndex] = {
    ...mockDatabase.projects[projectIndex],
    ...req.body,
    updatedAt: new Date()
  };

  res.json(mockDatabase.projects[projectIndex]);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  initializeDatabase();
  const projectId = parseInt(req.params.id);
  const projectIndex = mockDatabase.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  mockDatabase.projects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully' });
});

// Smart Contract Integration Endpoints
app.post('/api/escrow/create', (req, res) => {
  const { projectId, clientAddress, freelancerAddress, amount, milestones } = req.body;

  // Simulate smart contract deployment
  const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  res.json({
    success: true,
    contractAddress,
    transactionHash,
    projectId,
    amount,
    milestones: milestones || [
      { id: 1, amount: amount * 0.4, description: 'Initial Development', status: 'pending' },
      { id: 2, amount: amount * 0.4, description: 'Testing & Integration', status: 'pending' },
      { id: 3, amount: amount * 0.2, description: 'Final Delivery', status: 'pending' }
    ],
    gasUsed: 245000,
    gasPrice: '20000000000',
    blockNumber: 18500000 + Math.floor(Math.random() * 100000),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/escrow/deposit', (req, res) => {
  const { contractAddress, amount, token } = req.body;

  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  res.json({
    success: true,
    transactionHash,
    contractAddress,
    amount,
    token: token || 'USDC',
    status: 'confirmed',
    gasUsed: 65000,
    gasPrice: '20000000000',
    blockNumber: 18500000 + Math.floor(Math.random() * 100000),
    timestamp: new Date().toISOString(),
    confirmations: 12
  });
});

app.post('/api/escrow/release', (req, res) => {
  const { contractAddress, milestoneId, amount } = req.body;

  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  res.json({
    success: true,
    transactionHash,
    contractAddress,
    milestoneId,
    amount,
    status: 'released',
    gasUsed: 45000,
    gasPrice: '20000000000',
    blockNumber: 18500000 + Math.floor(Math.random() * 100000),
    timestamp: new Date().toISOString(),
    confirmations: 12
  });
});

app.get('/api/escrow/status/:contractAddress', (req, res) => {
  const { contractAddress } = req.params;

  res.json({
    contractAddress,
    totalAmount: 4000,
    releasedAmount: 1600,
    remainingAmount: 2400,
    status: 'active',
    milestones: [
      { id: 1, amount: 1600, description: 'Initial Development', status: 'completed', releasedAt: new Date(Date.now() - 86400000) },
      { id: 2, amount: 1600, description: 'Testing & Integration', status: 'in-progress', dueDate: new Date(Date.now() + 604800000) },
      { id: 3, amount: 800, description: 'Final Delivery', status: 'pending', dueDate: new Date(Date.now() + 1209600000) }
    ],
    createdAt: new Date(Date.now() - 172800000),
    lastActivity: new Date(Date.now() - 3600000)
  });
});

// Proposal Management with Contract Integration
app.post('/api/proposals/:id/accept', (req, res) => {
  initializeDatabase();
  const proposalId = req.params.id;
  const proposal = mockDatabase.proposals.find(p => p.id === proposalId);

  if (!proposal) {
    return res.status(404).json({ message: 'Proposal not found' });
  }

  // Update proposal status
  proposal.status = 'accepted';
  proposal.acceptedAt = new Date();

  // Simulate smart contract creation
  const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  res.json({
    success: true,
    proposal,
    contract: {
      address: contractAddress,
      transactionHash,
      amount: proposal.proposedBudget,
      status: 'deployed',
      gasUsed: 245000,
      blockNumber: 18500000 + Math.floor(Math.random() * 100000)
    }
  });
});

app.post('/api/proposals/:id/reject', (req, res) => {
  initializeDatabase();
  const proposalId = req.params.id;
  const { reason } = req.body;

  const proposal = mockDatabase.proposals.find(p => p.id === proposalId);

  if (!proposal) {
    return res.status(404).json({ message: 'Proposal not found' });
  }

  proposal.status = 'rejected';
  proposal.rejectedAt = new Date();
  proposal.rejectionReason = reason || 'Client chose a different freelancer';

  res.json({
    success: true,
    proposal
  });
});

// MasChain KYC Integration Endpoints
app.post('/api/kyc/initiate', (req, res) => {
  res.json({
    message: 'KYC verification initiated with MasChain',
    kycId: 'maschain-kyc-' + Date.now(),
    verificationUrl: 'https://maschain.com/kyc/verify/mock-session',
    sessionId: 'mc_session_' + Math.random().toString(36).substr(2, 9),
    estimatedTime: '5-10 minutes',
    requiredDocuments: ['Government ID', 'Proof of Address'],
    supportedCountries: ['Malaysia', 'Singapore', 'Thailand', 'Indonesia']
  });
});

app.get('/api/kyc/status', (req, res) => {
  res.json({
    status: 'verified',
    verificationLevel: 'Level 2 - Enhanced',
    data: {
      document_type: 'passport',
      document_number: 'A12345678',
      verification_date: new Date().toISOString(),
      country: 'Malaysia',
      verificationMethod: 'MasChain eKYC'
    },
    trustScore: 92,
    benefits: [
      '+15 Trust Score boost',
      'Access to premium projects',
      'Reduced escrow fees',
      'Priority support'
    ],
    masChainData: {
      verificationId: 'mc_verify_' + Date.now(),
      blockchainRecord: '0x8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      issuer: 'MasChain Verification Authority',
      issuedAt: new Date().toISOString()
    }
  });
});

// MasChain Trust NFT Certificates
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
          transactionHash: '0x8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
          mintedAt: '2024-06-15T12:30:00.000Z'
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
          transactionHash: '0x9f3b2c0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0b1',
          mintedAt: '2024-06-20T14:45:00.000Z'
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
          transactionHash: '0xa04c3d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0c2',
          mintedAt: '2024-05-28T16:20:00.000Z'
        }
      }
    ],
    totalCertificates: 3,
    totalTrustPoints: 325,
    averageRating: 4.9,
    verificationStatus: 'Verified by MasChain',
    portfolioValue: 20000,
    masChainIntegration: {
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96',
      network: 'MasChain Testnet',
      lastSync: new Date().toISOString()
    }
  });
});

// MasChain Skill Tokens Integration
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
        marketValue: 2.5,
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
        marketValue: 4.2,
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
        marketValue: 3.1,
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
        skill: 'Security Auditing',
        level: 8,
        balance: 420,
        tokenAddress: '0xb86h79Gg0978G3976369158e7fBH8H3gc10',
        earnedFrom: ['Smart Contract Audit', 'NFT Marketplace Optimization'],
        lastEarned: '2024-06-16T00:00:00.000Z',
        marketValue: 5.5,
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
    totalSkills: 4,
    totalTokenValue: 12847.5,
    skillLevels: {
      'React': 8,
      'Solidity': 9,
      'Web3': 7,
      'Security Auditing': 8
    },
    portfolioStats: {
      totalProjectsCompleted: 34,
      totalEarnings: 4040,
      averageProjectRating: 4.82,
      topSkill: 'Solidity',
      recentActivity: '2024-06-22T00:00:00.000Z'
    },
    masChainIntegration: {
      walletConnected: true,
      verificationStatus: 'Verified',
      skillRegistryContract: '0x742d35Cc6634C0532925a3b8D4C9db96',
      lastSync: new Date().toISOString(),
      network: 'MasChain Testnet'
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
        tokenBalance: 1250,
        projectsCompleted: 15,
        averageRating: 4.9,
        masChainVerified: true
      },
      {
        username: 'blockchainpro',
        name: 'Sarah Chen',
        trustScore: 88,
        skillLevel: 9,
        tokenBalance: 980,
        projectsCompleted: 12,
        averageRating: 4.8,
        masChainVerified: true
      },
      {
        username: 'web3builder',
        name: 'Mike Rodriguez',
        trustScore: 85,
        skillLevel: 8,
        tokenBalance: 750,
        projectsCompleted: 10,
        averageRating: 4.7,
        masChainVerified: true
      }
    ],
    totalParticipants: 3,
    lastUpdated: new Date().toISOString()
  });
});

// Proof-of-Work with MasChain verification
app.post('/api/proof-of-work/submit', (req, res) => {
  const { deliverableType, url, description } = req.body;

  const mockHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';

  res.json({
    message: 'Proof of work submitted and verified via MasChain',
    hash: mockHash,
    verificationStatus: 'verified',
    timestamp: new Date().toISOString(),
    deliverableType,
    originalUrl: url,
    masChainData: {
      verificationId: 'mc_pow_' + Date.now(),
      blockchainRecord: '0x' + Math.random().toString(16).substr(2, 64),
      network: 'MasChain Testnet',
      gasUsed: '21000',
      transactionFee: '0.001 MAS'
    }
  });
});

// Demo User Profiles - Diverse Freelancer and Client Profiles
app.get('/api/users/freelancers', (req, res) => {
  res.json({
    freelancers: [
      {
        id: 'user-1',
        username: 'cryptodev_alex',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        title: 'Senior Blockchain Developer',
        location: 'Singapore',
        timezone: 'GMT+8',
        memberSince: '2022-01-15',
        verified: true,
        trustScore: 92,
        rating: 4.9,
        totalReviews: 47,
        completedProjects: 52,
        totalEarnings: 125000,
        skills: [
          { name: 'Solidity', level: 9, tokens: 1250 },
          { name: 'React', level: 8, tokens: 980 },
          { name: 'Web3.js', level: 8, tokens: 750 },
          { name: 'DeFi', level: 9, tokens: 1100 }
        ],
        specializations: ['DeFi Development', 'Smart Contract Auditing', 'Cross-chain Solutions'],
        languages: ['English (Native)', 'Mandarin (Fluent)', 'Japanese (Basic)'],
        hourlyRate: { min: 75, max: 120, currency: 'USDC' },
        availability: 'Available',
        responseTime: '< 1 hour',
        portfolio: [
          {
            title: 'DeFi Yield Farming Protocol',
            description: 'Built a comprehensive yield farming protocol with automated strategies',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300',
            technologies: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
            projectValue: 15000,
            completionDate: '2024-05-20'
          },
          {
            title: 'Cross-Chain Bridge Interface',
            description: 'Developed secure bridge connecting Ethereum and Polygon',
            image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=300',
            technologies: ['Solidity', 'LayerZero', 'TypeScript', 'Next.js'],
            projectValue: 22000,
            completionDate: '2024-04-15'
          }
        ],
        masChainData: {
          kycStatus: 'verified',
          trustNFTs: 8,
          skillTokensValue: 4080,
          verificationLevel: 'Enterprise'
        }
      },
      {
        id: 'user-2',
        username: 'sarah_blockchain',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        title: 'Full-Stack Web3 Developer',
        location: 'Toronto, Canada',
        timezone: 'GMT-5',
        memberSince: '2021-08-22',
        verified: true,
        trustScore: 88,
        rating: 4.8,
        totalReviews: 63,
        completedProjects: 71,
        totalEarnings: 98000,
        skills: [
          { name: 'React', level: 9, tokens: 1450 },
          { name: 'Node.js', level: 8, tokens: 920 },
          { name: 'Solidity', level: 7, tokens: 680 },
          { name: 'UI/UX Design', level: 8, tokens: 750 }
        ],
        specializations: ['Frontend Development', 'dApp Development', 'User Experience'],
        languages: ['English (Native)', 'French (Fluent)', 'Mandarin (Conversational)'],
        hourlyRate: { min: 65, max: 95, currency: 'USDC' },
        availability: 'Available',
        responseTime: '< 2 hours',
        portfolio: [
          {
            title: 'NFT Marketplace Frontend',
            description: 'Built responsive frontend for multi-chain NFT marketplace',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
            technologies: ['React', 'TypeScript', 'Web3.js', 'Tailwind CSS'],
            projectValue: 8500,
            completionDate: '2024-06-10'
          },
          {
            title: 'DAO Governance Platform',
            description: 'Complete governance interface with voting and proposal systems',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
            technologies: ['Next.js', 'React', 'Ethers.js', 'Chakra UI'],
            projectValue: 12000,
            completionDate: '2024-03-28'
          }
        ],
        masChainData: {
          kycStatus: 'verified',
          trustNFTs: 12,
          skillTokensValue: 3800,
          verificationLevel: 'Professional'
        }
      },
      {
        id: 'user-3',
        username: 'mike_security',
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        title: 'Smart Contract Security Auditor',
        location: 'Mexico City, Mexico',
        timezone: 'GMT-6',
        memberSince: '2021-11-30',
        verified: true,
        trustScore: 95,
        rating: 4.95,
        totalReviews: 28,
        completedProjects: 31,
        totalEarnings: 156000,
        skills: [
          { name: 'Security Auditing', level: 10, tokens: 1850 },
          { name: 'Solidity', level: 9, tokens: 1200 },
          { name: 'Formal Verification', level: 8, tokens: 650 },
          { name: 'Penetration Testing', level: 9, tokens: 800 }
        ],
        specializations: ['Smart Contract Auditing', 'Security Research', 'Formal Verification'],
        languages: ['Spanish (Native)', 'English (Fluent)', 'Portuguese (Conversational)'],
        hourlyRate: { min: 100, max: 200, currency: 'USDC' },
        availability: 'Selective',
        responseTime: '< 4 hours',
        portfolio: [
          {
            title: 'DeFi Protocol Security Audit',
            description: 'Comprehensive security audit for $50M TVL DeFi protocol',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300',
            technologies: ['Solidity', 'Foundry', 'Slither', 'Mythril'],
            projectValue: 25000,
            completionDate: '2024-05-15'
          },
          {
            title: 'Cross-Chain Bridge Audit',
            description: 'Security assessment for multi-billion dollar bridge protocol',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
            technologies: ['Solidity', 'Formal Verification', 'Certora', 'Manual Review'],
            projectValue: 35000,
            completionDate: '2024-02-20'
          }
        ],
        masChainData: {
          kycStatus: 'verified',
          trustNFTs: 6,
          skillTokensValue: 4500,
          verificationLevel: 'Expert'
        }
      }
    ],
    totalFreelancers: 3,
    filters: {
      skills: ['React', 'Solidity', 'Web3.js', 'Security Auditing', 'Node.js', 'UI/UX Design'],
      locations: ['Singapore', 'Toronto, Canada', 'Mexico City, Mexico'],
      hourlyRates: ['$50-75', '$75-100', '$100-150', '$150+'],
      availability: ['Available', 'Selective', 'Busy']
    }
  });
});

// Demo Client Profiles
app.get('/api/users/clients', (req, res) => {
  res.json({
    clients: [
      {
        id: 'client-1',
        companyName: 'DeFi Capital Partners',
        contactName: 'Jennifer Liu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        industry: 'Financial Technology',
        location: 'Singapore',
        timezone: 'GMT+8',
        memberSince: '2022-03-15',
        verified: true,
        rating: 4.9,
        totalReviews: 127,
        projectsPosted: 89,
        totalSpent: 450000,
        activeProjects: 5,
        companySize: '50-200 employees',
        description: 'Leading DeFi investment firm focused on yield optimization and cross-chain protocols. We work with top-tier developers to build the future of decentralized finance.',
        website: 'https://deficapital.partners',
        specialties: ['DeFi Protocols', 'Yield Farming', 'Cross-chain Solutions', 'Trading Algorithms'],
        preferredSkills: ['Solidity', 'React', 'Web3.js', 'DeFi', 'TypeScript'],
        budgetRange: { min: 5000, max: 50000, currency: 'USDC' },
        paymentHistory: {
          onTime: 98,
          averagePaymentTime: '2.1 days',
          totalPaid: 450000
        },
        recentProjects: [
          {
            title: 'Advanced DeFi Dashboard',
            budget: 15000,
            status: 'completed',
            rating: 5,
            completedDate: '2024-06-15'
          },
          {
            title: 'Cross-Chain Bridge Development',
            budget: 35000,
            status: 'in-progress',
            startDate: '2024-06-20'
          }
        ],
        masChainData: {
          kycStatus: 'enterprise-verified',
          businessVerification: 'completed',
          paymentMethod: 'crypto-escrow',
          trustLevel: 'platinum'
        }
      },
      {
        id: 'client-2',
        companyName: 'ArtBlock Studios',
        contactName: 'Marcus Thompson',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        industry: 'Digital Art & NFTs',
        location: 'New York, USA',
        timezone: 'GMT-5',
        memberSince: '2021-11-20',
        verified: true,
        rating: 4.8,
        totalReviews: 89,
        projectsPosted: 67,
        totalSpent: 320000,
        activeProjects: 3,
        companySize: '20-50 employees',
        description: 'Premier NFT marketplace and digital art platform. We create innovative experiences for artists and collectors in the Web3 space.',
        website: 'https://artblockstudios.com',
        specialties: ['NFT Marketplaces', 'Digital Art Platforms', 'Creator Tools', 'Blockchain Gaming'],
        preferredSkills: ['Solidity', 'React', 'IPFS', 'NFT Standards', 'UI/UX Design'],
        budgetRange: { min: 3000, max: 25000, currency: 'USDC' },
        paymentHistory: {
          onTime: 95,
          averagePaymentTime: '1.8 days',
          totalPaid: 320000
        },
        recentProjects: [
          {
            title: 'NFT Marketplace Security Audit',
            budget: 12000,
            status: 'completed',
            rating: 4.9,
            completedDate: '2024-06-10'
          },
          {
            title: 'Creator Royalty System',
            budget: 8500,
            status: 'completed',
            rating: 4.8,
            completedDate: '2024-05-28'
          }
        ],
        masChainData: {
          kycStatus: 'business-verified',
          businessVerification: 'completed',
          paymentMethod: 'hybrid-escrow',
          trustLevel: 'gold'
        }
      },
      {
        id: 'client-3',
        companyName: 'MultiChain Labs',
        contactName: 'Dr. Elena Vasquez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        industry: 'Blockchain Infrastructure',
        location: 'San Francisco, USA',
        timezone: 'GMT-8',
        memberSince: '2021-05-12',
        verified: true,
        rating: 4.9,
        totalReviews: 234,
        projectsPosted: 156,
        totalSpent: 890000,
        activeProjects: 8,
        companySize: '200+ employees',
        description: 'Leading blockchain infrastructure company building the future of cross-chain interoperability. We develop cutting-edge protocols and tools for the multi-chain ecosystem.',
        website: 'https://multichainlabs.io',
        specialties: ['Cross-chain Protocols', 'Blockchain Infrastructure', 'Interoperability', 'Layer 2 Solutions'],
        preferredSkills: ['Solidity', 'Rust', 'Go', 'Cross-chain', 'Security', 'DevOps'],
        budgetRange: { min: 10000, max: 100000, currency: 'USDC' },
        paymentHistory: {
          onTime: 99,
          averagePaymentTime: '1.2 days',
          totalPaid: 890000
        },
        recentProjects: [
          {
            title: 'Cross-Chain Bridge Protocol',
            budget: 75000,
            status: 'completed',
            rating: 4.9,
            completedDate: '2024-05-30'
          },
          {
            title: 'Layer 2 Scaling Solution',
            budget: 120000,
            status: 'in-progress',
            startDate: '2024-06-01'
          }
        ],
        masChainData: {
          kycStatus: 'enterprise-verified',
          businessVerification: 'completed',
          paymentMethod: 'institutional-escrow',
          trustLevel: 'platinum'
        }
      }
    ],
    totalClients: 3,
    filters: {
      industries: ['Financial Technology', 'Digital Art & NFTs', 'Blockchain Infrastructure'],
      companySizes: ['1-10', '10-50', '50-200', '200+'],
      budgetRanges: ['$1K-5K', '$5K-25K', '$25K-100K', '$100K+'],
      locations: ['Singapore', 'New York, USA', 'San Francisco, USA']
    }
  });
});

// Transaction monitoring endpoint
app.get('/api/transactions', optionalAuth, (req, res) => {
  // Mock transaction data for demo
  const transactions = [
    {
      id: 'tx_1',
      type: 'deposit',
      amount: 4000,
      currency: 'USDC',
      status: 'confirmed',
      transactionHash: '0x8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      blockNumber: 18567890,
      gasUsed: 65000,
      gasPrice: '20000000000',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      confirmations: 24,
      project: { id: 1, title: 'DeFi Dashboard Development' },
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    },
    {
      id: 'tx_2',
      type: 'release',
      amount: 1600,
      currency: 'USDC',
      status: 'confirmed',
      transactionHash: '0x7e1a0b8c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      blockNumber: 18568120,
      gasUsed: 45000,
      gasPrice: '18000000000',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      confirmations: 18,
      project: { id: 1, title: 'DeFi Dashboard Development' },
      milestone: { id: 1, description: 'Frontend Development' },
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }
  ];

  res.json({ transactions });
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FairLance Backend (Working) running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
