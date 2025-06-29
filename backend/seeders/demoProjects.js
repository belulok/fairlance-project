// Demo Projects with Blockchain Integration
const demoProjects = [
  {
    id: 'proj_001',
    title: 'E-commerce Website Development',
    description: 'Build a modern e-commerce platform with React and Node.js. Includes payment integration, user authentication, and admin dashboard.',
    client: {
      name: 'TechStart Inc.',
      wallet: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      rating: 4.8,
      projectsCompleted: 12
    },
    freelancer: {
      name: 'Alex Chen',
      wallet: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063',
      rating: 4.9,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      kycVerified: true
    },
    budget: {
      amount: 500.00,
      currency: 'MAS',
      escrowContract: '0xabcdef1234567890abcdef1234567890abcdef12'
    },
    milestones: [
      {
        id: 1,
        title: 'UI/UX Design & Wireframes',
        description: 'Create complete design system and wireframes',
        amount: 150.00,
        status: 'completed',
        completedAt: '2024-06-20T10:00:00Z',
        proofOfWork: {
          githubCommit: 'a1b2c3d4e5f6789012345678901234567890abcd',
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
          description: 'Design files and wireframes uploaded to IPFS'
        }
      },
      {
        id: 2,
        title: 'Frontend Development',
        description: 'Implement React components and responsive design',
        amount: 200.00,
        status: 'in_progress',
        startedAt: '2024-06-21T09:00:00Z',
        proofOfWork: {
          githubCommit: 'b2c3d4e5f6789012345678901234567890abcdef1',
          description: 'Frontend components development in progress'
        }
      },
      {
        id: 3,
        title: 'Backend API & Database',
        description: 'Build REST API and database integration',
        amount: 150.00,
        status: 'pending'
      }
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    category: 'Web Development',
    duration: '4 weeks',
    status: 'in_progress',
    createdAt: '2024-06-15T08:00:00Z',
    blockchain: {
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      totalLocked: 500.00,
      released: 150.00,
      pending: 350.00,
      transactions: [
        {
          hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
          type: 'escrow_deposit',
          amount: 500.00,
          timestamp: '2024-06-15T08:30:00Z'
        },
        {
          hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a',
          type: 'milestone_release',
          amount: 150.00,
          milestone: 1,
          timestamp: '2024-06-20T15:00:00Z'
        }
      ]
    }
  },
  {
    id: 'proj_002',
    title: 'Mobile App UI/UX Design',
    description: 'Design a modern mobile app interface for a fitness tracking application. Includes user research, wireframes, and high-fidelity mockups.',
    client: {
      name: 'FitLife Solutions',
      wallet: '0x9f4CF7ad23Cd3CaDbD9735AFf958023239c6A064',
      rating: 4.6,
      projectsCompleted: 8
    },
    freelancer: {
      name: 'Sarah Johnson',
      wallet: '0x1234567890abcdef1234567890abcdef12345679',
      rating: 4.8,
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
      kycVerified: true
    },
    budget: {
      amount: 300.00,
      currency: 'MAS',
      escrowContract: '0xbcdef1234567890abcdef1234567890abcdef123'
    },
    milestones: [
      {
        id: 1,
        title: 'User Research & Analysis',
        description: 'Conduct user interviews and competitive analysis',
        amount: 100.00,
        status: 'completed',
        completedAt: '2024-06-18T14:00:00Z',
        proofOfWork: {
          ipfsHash: 'QmXjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE8p',
          description: 'User research report and competitive analysis'
        }
      },
      {
        id: 2,
        title: 'Wireframes & User Flow',
        description: 'Create detailed wireframes and user journey maps',
        amount: 100.00,
        status: 'completed',
        completedAt: '2024-06-22T16:00:00Z',
        proofOfWork: {
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE9q',
          description: 'Wireframes and user flow diagrams'
        }
      },
      {
        id: 3,
        title: 'High-Fidelity Mockups',
        description: 'Design final UI mockups with branding',
        amount: 100.00,
        status: 'in_progress',
        startedAt: '2024-06-23T10:00:00Z'
      }
    ],
    skills: ['UI/UX Design', 'Mobile Design', 'Figma', 'User Research'],
    category: 'Design',
    duration: '3 weeks',
    status: 'in_progress',
    createdAt: '2024-06-10T10:00:00Z',
    blockchain: {
      contractAddress: '0xbcdef1234567890abcdef1234567890abcdef123',
      totalLocked: 300.00,
      released: 200.00,
      pending: 100.00,
      transactions: [
        {
          hash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789b',
          type: 'escrow_deposit',
          amount: 300.00,
          timestamp: '2024-06-10T10:30:00Z'
        },
        {
          hash: '0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789bc3',
          type: 'milestone_release',
          amount: 100.00,
          milestone: 1,
          timestamp: '2024-06-18T14:30:00Z'
        },
        {
          hash: '0xe5f6789012345678901234567890abcdef1234567890abcdef123456789bc3d4',
          type: 'milestone_release',
          amount: 100.00,
          milestone: 2,
          timestamp: '2024-06-22T16:30:00Z'
        }
      ]
    }
  },
  {
    id: 'proj_003',
    title: 'Smart Contract Development',
    description: 'Develop and deploy smart contracts for a DeFi lending platform. Includes security auditing and comprehensive testing.',
    client: {
      name: 'DeFi Innovations',
      wallet: '0x2345678901abcdef2345678901abcdef23456780',
      rating: 4.9,
      projectsCompleted: 15
    },
    freelancer: {
      name: 'Michael Rodriguez',
      wallet: '0x3456789012abcdef3456789012abcdef34567801',
      rating: 5.0,
      skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Security Auditing'],
      kycVerified: true
    },
    budget: {
      amount: 800.00,
      currency: 'MAS',
      escrowContract: '0xcdef1234567890abcdef1234567890abcdef1234'
    },
    milestones: [
      {
        id: 1,
        title: 'Contract Architecture & Planning',
        description: 'Design smart contract architecture and security considerations',
        amount: 200.00,
        status: 'completed',
        completedAt: '2024-06-12T11:00:00Z',
        proofOfWork: {
          githubCommit: 'f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6',
          ipfsHash: 'QmZjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE0r',
          description: 'Smart contract specifications and architecture docs'
        }
      },
      {
        id: 2,
        title: 'Core Contract Development',
        description: 'Implement lending and borrowing functionality',
        amount: 300.00,
        status: 'in_progress',
        startedAt: '2024-06-13T09:00:00Z',
        proofOfWork: {
          githubCommit: 'g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7',
          description: 'Core lending contracts implementation'
        }
      },
      {
        id: 3,
        title: 'Testing & Security Audit',
        description: 'Comprehensive testing and security audit',
        amount: 200.00,
        status: 'pending'
      },
      {
        id: 4,
        title: 'Deployment & Documentation',
        description: 'Deploy to mainnet and create documentation',
        amount: 100.00,
        status: 'pending'
      }
    ],
    skills: ['Solidity', 'Smart Contracts', 'DeFi', 'Testing', 'Security'],
    category: 'Blockchain Development',
    duration: '6 weeks',
    status: 'in_progress',
    createdAt: '2024-06-05T09:00:00Z',
    blockchain: {
      contractAddress: '0xcdef1234567890abcdef1234567890abcdef1234',
      totalLocked: 800.00,
      released: 200.00,
      pending: 600.00,
      transactions: [
        {
          hash: '0xf6789012345678901234567890abcdef1234567890abcdef123456789bc3d4e5',
          type: 'escrow_deposit',
          amount: 800.00,
          timestamp: '2024-06-05T09:30:00Z'
        },
        {
          hash: '0x789012345678901234567890abcdef1234567890abcdef123456789bc3d4e5f6',
          type: 'milestone_release',
          amount: 200.00,
          milestone: 1,
          timestamp: '2024-06-12T11:30:00Z'
        }
      ]
    }
  }
];

module.exports = demoProjects;
