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

// Mock projects endpoint
app.get('/api/projects', (req, res) => {
  const mockProjects = [
    {
      id: 1,
      title: "Build DeFi Dashboard",
      description: "Create a modern DeFi dashboard with real-time analytics, portfolio tracking, and yield farming opportunities. Must have experience with React, Web3.js, and DeFi protocols.",
      budget: { min: 400, max: 600, currency: "USDC" },
      deadline: new Date(Date.now() + 172800000),
      category: "Development",
      skills: ["React", "Web3.js", "DeFi", "TypeScript"],
      client: {
        name: "CryptoVentures",
        rating: 4.8,
        reviews: 23,
        verified: true
      },
      proposals: 12,
      featured: true,
      status: "open"
    },
    {
      id: 2,
      title: "Smart Contract Audit",
      description: "Security audit for NFT marketplace smart contracts. Need comprehensive testing, vulnerability assessment, and detailed report with recommendations.",
      budget: { min: 1000, max: 1500, currency: "USDC" },
      deadline: new Date(Date.now() + 259200000),
      category: "Security",
      skills: ["Solidity", "Security", "Smart Contracts", "Auditing"],
      client: {
        name: "NFTMarket",
        rating: 4.9,
        reviews: 45,
        verified: true
      },
      proposals: 8,
      featured: false,
      status: "open"
    },
    {
      id: 3,
      title: "Web3 Mobile App Design",
      description: "Design a modern mobile app for decentralized social media platform. Need UI/UX design, prototyping, and design system creation.",
      budget: { min: 700, max: 900, currency: "USDC" },
      deadline: new Date(Date.now() + 345600000),
      category: "Design",
      skills: ["UI/UX", "Mobile Design", "Figma", "Prototyping"],
      client: {
        name: "SocialDAO",
        rating: 4.7,
        reviews: 18,
        verified: false
      },
      proposals: 15,
      featured: true,
      status: "open"
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
