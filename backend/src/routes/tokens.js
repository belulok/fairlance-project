const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const { auth, requireKYC } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// Skill token configurations
const SKILL_TOKENS = {
  'React': { symbol: 'REACT', decimals: 0 },
  'Solidity': { symbol: 'SOL', decimals: 0 },
  'JavaScript': { symbol: 'JS', decimals: 0 },
  'Python': { symbol: 'PY', decimals: 0 },
  'Design': { symbol: 'DESIGN', decimals: 0 },
  'Marketing': { symbol: 'MKT', decimals: 0 },
  'Security': { symbol: 'SEC', decimals: 0 },
  'Web3': { symbol: 'WEB3', decimals: 0 },
  'DeFi': { symbol: 'DEFI', decimals: 0 },
  'NFT': { symbol: 'NFT', decimals: 0 }
};

// @route   POST /api/tokens/award-skill-tokens
// @desc    Award skill tokens after project completion
// @access  Private (System)
router.post('/award-skill-tokens', auth, async (req, res) => {
  try {
    const { projectId, freelancerId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Check if project is completed
    if (project.status !== 'completed') {
      return res.status(400).json({ message: 'Project must be completed to award skill tokens' });
    }

    // Check if tokens already awarded for this project
    const existingTokens = freelancer.skillTokens.filter(token => 
      token.metadata && token.metadata.projectId === projectId
    );

    if (existingTokens.length > 0) {
      return res.status(400).json({ message: 'Skill tokens already awarded for this project' });
    }

    try {
      const awardedTokens = [];

      // Award tokens for each skill used in the project
      for (const skill of project.skills) {
        if (SKILL_TOKENS[skill]) {
          const tokenConfig = SKILL_TOKENS[skill];
          
          // Calculate token amount based on project complexity and rating
          const tokenAmount = calculateSkillTokenAmount(project, skill);
          
          // Check if skill token contract exists, create if not
          let tokenAddress = await getOrCreateSkillToken(skill, tokenConfig);
          
          // Mint tokens to freelancer
          const mintResponse = await maschain.mintToken(
            tokenAddress,
            freelancer.walletAddress,
            tokenAmount
          );

          // Update freelancer's skill tokens
          const existingSkillToken = freelancer.skillTokens.find(t => t.skill === skill);
          
          if (existingSkillToken) {
            existingSkillToken.balance += tokenAmount;
            existingSkillToken.level = calculateSkillLevel(existingSkillToken.balance);
          } else {
            freelancer.skillTokens.push({
              tokenAddress,
              skill,
              level: calculateSkillLevel(tokenAmount),
              balance: tokenAmount,
              earnedDate: new Date(),
              metadata: {
                projectId: project._id.toString(),
                projectTitle: project.title
              }
            });
          }

          awardedTokens.push({
            skill,
            amount: tokenAmount,
            tokenAddress,
            transactionHash: mintResponse.transaction_hash
          });
        }
      }

      await freelancer.save();

      res.status(201).json({
        message: 'Skill tokens awarded successfully',
        awardedTokens,
        totalSkillTokens: freelancer.skillTokens.length
      });
    } catch (error) {
      console.error('MasChain token minting error:', error);
      res.status(500).json({ message: 'Failed to award skill tokens' });
    }
  } catch (error) {
    console.error('Award skill tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tokens/my-skills
// @desc    Get user's skill tokens
// @access  Private
router.get('/my-skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get updated balances from blockchain
    const updatedTokens = [];
    
    for (const skillToken of user.skillTokens) {
      try {
        const balance = await maschain.getTokenBalance(
          skillToken.tokenAddress,
          user.walletAddress
        );
        
        updatedTokens.push({
          ...skillToken.toObject(),
          currentBalance: balance,
          level: calculateSkillLevel(balance)
        });
      } catch (error) {
        // If can't get balance, use stored balance
        updatedTokens.push(skillToken.toObject());
      }
    }

    res.json({
      skillTokens: updatedTokens,
      totalSkills: updatedTokens.length,
      skillLevels: updatedTokens.reduce((acc, token) => {
        acc[token.skill] = token.level || calculateSkillLevel(token.balance);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get my skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tokens/skill-leaderboard/:skill
// @desc    Get skill token leaderboard
// @access  Public
router.get('/skill-leaderboard/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const { limit = 10 } = req.query;

    const users = await User.find({
      'skillTokens.skill': skill
    })
    .select('username firstName lastName avatar skillTokens trustScore')
    .limit(Number(limit));

    const leaderboard = users
      .map(user => {
        const skillToken = user.skillTokens.find(t => t.skill === skill);
        return {
          userId: user._id,
          username: user.username,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar,
          trustScore: user.trustScore,
          skillLevel: skillToken ? calculateSkillLevel(skillToken.balance) : 0,
          tokenBalance: skillToken ? skillToken.balance : 0
        };
      })
      .sort((a, b) => b.tokenBalance - a.tokenBalance);

    res.json({
      skill,
      leaderboard,
      totalParticipants: leaderboard.length
    });
  } catch (error) {
    console.error('Get skill leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tokens/available-skills
// @desc    Get all available skill tokens
// @access  Public
router.get('/available-skills', async (req, res) => {
  try {
    const skills = Object.keys(SKILL_TOKENS).map(skill => ({
      name: skill,
      symbol: SKILL_TOKENS[skill].symbol,
      decimals: SKILL_TOKENS[skill].decimals
    }));

    res.json({ skills });
  } catch (error) {
    console.error('Get available skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
async function getOrCreateSkillToken(skill, tokenConfig) {
  // In a real implementation, you'd store token addresses in a database
  // For now, we'll simulate this
  const tokenName = `${skill} Skill Token`;
  
  try {
    // Try to create token (in real implementation, check if exists first)
    const tokenResponse = await maschain.createToken({
      name: tokenName,
      symbol: tokenConfig.symbol,
      totalSupply: 1000000, // Large supply for skill tokens
      decimals: tokenConfig.decimals,
      metadata: {
        skill: skill,
        type: 'SKILL_TOKEN',
        description: `Skill token for demonstrating ${skill} expertise`
      }
    });

    return tokenResponse.token_address;
  } catch (error) {
    console.error('Error creating skill token:', error);
    throw error;
  }
}

function calculateSkillTokenAmount(project, skill) {
  let baseAmount = 10; // Base tokens per project
  
  // Bonus based on project value
  const projectValue = project.budget.max;
  if (projectValue >= 1000) baseAmount += 20;
  else if (projectValue >= 500) baseAmount += 15;
  else if (projectValue >= 100) baseAmount += 10;
  else baseAmount += 5;
  
  // Bonus for primary skills (skills listed first get more tokens)
  const skillIndex = project.skills.indexOf(skill);
  if (skillIndex === 0) baseAmount += 10; // Primary skill
  else if (skillIndex === 1) baseAmount += 5; // Secondary skill
  
  // Category-specific bonuses
  const categoryBonus = {
    'security': 15,
    'development': 10,
    'design': 8,
    'marketing': 5
  };
  
  if (project.category.toLowerCase() === skill.toLowerCase()) {
    baseAmount += categoryBonus[project.category] || 0;
  }
  
  return baseAmount;
}

function calculateSkillLevel(tokenBalance) {
  if (tokenBalance >= 1000) return 10; // Expert
  if (tokenBalance >= 500) return 8;   // Advanced
  if (tokenBalance >= 200) return 6;   // Intermediate
  if (tokenBalance >= 100) return 4;   // Beginner+
  if (tokenBalance >= 50) return 2;    // Beginner
  return 1; // Novice
}

module.exports = router;
