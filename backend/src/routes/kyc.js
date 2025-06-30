const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// @route   POST /api/kyc/initiate
// @desc    Initiate KYC verification
// @access  Private
router.post('/initiate', auth, async (req, res) => {
  try {
    if (req.user.kycStatus === 'verified') {
      return res.status(400).json({ message: 'KYC already verified' });
    }

    const callbackUrl = `${process.env.CORS_ORIGIN}/api/kyc/callback`;
    const redirectUrl = `${process.env.CORS_ORIGIN}/kyc/result`;

    try {
      const kycResponse = await maschain.initiateKYC({
        userId: req.user._id.toString(),
        callbackUrl,
        redirectUrl
      });

      // Update user with KYC ID
      const user = await User.findById(req.user._id);
      user.kycId = kycResponse.kyc_id;
      user.kycStatus = 'pending';
      await user.save();

      res.json({
        message: 'KYC verification initiated',
        kycId: kycResponse.kyc_id,
        verificationUrl: kycResponse.verification_url
      });
    } catch (error) {
      console.error('MasChain KYC initiation error:', error);

      // Demo fallback - simulate KYC process
      console.log('Falling back to demo KYC process');

      res.json({
        success: true,
        message: 'Demo KYC verification initiated',
        demo: true,
        verificationUrl: null // Will trigger demo mode in frontend
      });
    }
  } catch (error) {
    console.error('Initiate KYC error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/kyc/status
// @desc    Get KYC verification status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    if (!req.user.kycId) {
      return res.json({ 
        status: 'not_started',
        message: 'KYC verification not initiated'
      });
    }

    try {
      const kycStatus = await maschain.getKYCStatus(req.user.kycId);
      
      // Update user status if changed
      if (kycStatus.status !== req.user.kycStatus) {
        const user = await User.findById(req.user._id);
        user.kycStatus = kycStatus.status;
        
        if (kycStatus.status === 'verified' && kycStatus.data) {
          user.kycData = {
            documentType: kycStatus.data.document_type,
            documentNumber: kycStatus.data.document_number,
            verificationDate: new Date(),
            expiryDate: kycStatus.data.expiry_date ? new Date(kycStatus.data.expiry_date) : null
          };
          
          // Recalculate trust score with KYC bonus
          user.calculateTrustScore();
        }
        
        await user.save();
      }

      res.json({
        status: kycStatus.status,
        data: kycStatus.data,
        trustScore: req.user.trustScore
      });
    } catch (error) {
      console.error('MasChain KYC status error:', error);

      // Demo fallback - return demo status
      res.json({
        status: req.user.kycStatus || 'not_started',
        trustScore: req.user.trustScore,
        demo: true
      });
    }
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/kyc/callback
// @desc    KYC verification callback from MasChain
// @access  Public (webhook)
router.post('/callback', async (req, res) => {
  try {
    const { kyc_id, status, user_id, data } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.kycStatus = status;
    
    if (status === 'verified' && data) {
      user.kycData = {
        documentType: data.document_type,
        documentNumber: data.document_number,
        verificationDate: new Date(),
        expiryDate: data.expiry_date ? new Date(data.expiry_date) : null
      };
      
      // Recalculate trust score with KYC bonus
      user.calculateTrustScore();
    }
    
    await user.save();

    res.json({ message: 'KYC status updated successfully' });
  } catch (error) {
    console.error('KYC callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
