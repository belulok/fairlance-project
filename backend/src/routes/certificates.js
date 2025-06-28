const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const { auth, requireKYC } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// @route   POST /api/certificates/issue-trust-nft
// @desc    Issue Trust NFT after project completion
// @access  Private (System/Client)
router.post('/issue-trust-nft', auth, async (req, res) => {
  try {
    const { projectId, freelancerId, rating, completionBonus } = req.body;

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
      return res.status(400).json({ message: 'Project must be completed to issue Trust NFT' });
    }

    // Check if Trust NFT already issued for this project
    const existingNFT = freelancer.trustNFTs.find(nft => 
      nft.metadata && nft.metadata.projectId === projectId
    );

    if (existingNFT) {
      return res.status(400).json({ message: 'Trust NFT already issued for this project' });
    }

    try {
      // Calculate trust points based on project completion
      const trustPoints = calculateTrustPoints(project, rating, completionBonus);
      
      const certificateData = {
        recipientWallet: freelancer.walletAddress,
        type: 'TRUST_NFT',
        metadata: {
          projectId: project._id.toString(),
          projectTitle: project.title,
          clientId: project.clientId.toString(),
          completionDate: new Date(),
          rating: rating,
          trustPoints: trustPoints,
          category: project.category,
          skills: project.skills,
          budget: project.budget,
          duration: project.timeline
        },
        attributes: {
          trust_score: trustPoints,
          project_category: project.category,
          completion_rating: rating,
          project_value: project.budget.max,
          skills_demonstrated: project.skills.join(',')
        }
      };

      const certificateResponse = await maschain.issueCertificate(certificateData);

      // Update freelancer's trust NFTs
      freelancer.trustNFTs.push({
        certificateId: certificateResponse.certificate_id,
        type: 'TRUST_NFT',
        issuedDate: new Date(),
        metadata: certificateData.metadata
      });

      // Update trust score
      freelancer.calculateTrustScore();
      await freelancer.save();

      res.status(201).json({
        message: 'Trust NFT issued successfully',
        certificate: {
          id: certificateResponse.certificate_id,
          trustPoints: trustPoints,
          newTrustScore: freelancer.trustScore
        }
      });
    } catch (error) {
      console.error('MasChain certificate issuance error:', error);
      res.status(500).json({ message: 'Failed to issue Trust NFT' });
    }
  } catch (error) {
    console.error('Issue Trust NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/my-nfts
// @desc    Get user's Trust NFTs
// @access  Private
router.get('/my-nfts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.walletAddress) {
      return res.json({ certificates: [] });
    }

    try {
      const certificates = await maschain.getCertificatesByWallet(user.walletAddress);
      
      res.json({
        certificates: certificates,
        localNFTs: user.trustNFTs
      });
    } catch (error) {
      console.error('MasChain get certificates error:', error);
      res.json({ certificates: user.trustNFTs });
    }
  } catch (error) {
    console.error('Get my NFTs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const certificate = await maschain.getCertificate(req.params.id);
    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Certificate not found' });
  }
});

// @route   POST /api/certificates/verify
// @desc    Verify certificate authenticity
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { certificateId, walletAddress } = req.body;

    if (!certificateId) {
      return res.status(400).json({ message: 'Certificate ID required' });
    }

    try {
      const certificate = await maschain.getCertificate(certificateId);
      
      const isValid = certificate && 
                     (!walletAddress || certificate.recipient_wallet === walletAddress);

      res.json({
        isValid,
        certificate: isValid ? certificate : null,
        verificationDate: new Date()
      });
    } catch (error) {
      res.json({
        isValid: false,
        error: 'Certificate not found or invalid'
      });
    }
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate trust points
function calculateTrustPoints(project, rating, completionBonus = 0) {
  let points = 0;
  
  // Base points for completion (10-50 based on project value)
  const projectValue = project.budget.max;
  if (projectValue >= 1000) points += 50;
  else if (projectValue >= 500) points += 30;
  else if (projectValue >= 100) points += 20;
  else points += 10;
  
  // Rating bonus (0-25 points)
  points += Math.round((rating / 5) * 25);
  
  // Category bonus
  const categoryBonus = {
    'security': 15,
    'development': 10,
    'design': 8,
    'marketing': 5,
    'writing': 3
  };
  points += categoryBonus[project.category] || 0;
  
  // Completion bonus
  points += completionBonus || 0;
  
  return Math.min(points, 100); // Cap at 100 points per project
}

module.exports = router;
