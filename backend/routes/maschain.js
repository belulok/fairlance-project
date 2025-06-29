const express = require('express');
const router = express.Router();
const masChainService = require('../services/maschain');
const { auth } = require('../src/middleware/auth');

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await masChainService.healthCheck();
    res.json({
      success: true,
      maschain: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MasChain health check failed',
      error: error.message
    });
  }
});

// Wallet Management Routes
router.post('/wallet/create', auth, async (req, res) => {
  try {
    const { walletName } = req.body;
    const userId = req.user.id;

    const result = await masChainService.createWallet(userId, walletName);
    
    res.json({
      success: true,
      message: 'Wallet creation initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create wallet',
      error: error.message
    });
  }
});

router.get('/wallet/balance/:address', auth, async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await masChainService.getWalletBalance(address);
    
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
      error: error.message
    });
  }
});

// Token Management Routes
router.post('/token/create', auth, async (req, res) => {
  try {
    const tokenData = req.body;
    const result = await masChainService.createToken(tokenData);
    
    res.json({
      success: true,
      message: 'Token creation initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create token',
      error: error.message
    });
  }
});

router.post('/token/transfer', auth, async (req, res) => {
  try {
    const { fromWallet, toWallet, tokenAddress, amount } = req.body;
    const result = await masChainService.transferToken(fromWallet, toWallet, tokenAddress, amount);
    
    res.json({
      success: true,
      message: 'Token transfer initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to transfer token',
      error: error.message
    });
  }
});

// KYC Management Routes
router.post('/kyc/initiate', auth, async (req, res) => {
  try {
    const userData = {
      userId: req.user.id,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone
    };

    const result = await masChainService.initiateKYC(userData);
    
    res.json({
      success: true,
      message: 'KYC process initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate KYC',
      error: error.message
    });
  }
});

router.get('/kyc/status', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const status = await masChainService.getKYCStatus(userId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get KYC status',
      error: error.message
    });
  }
});

// Smart Contract Routes
router.post('/contract/escrow/deploy', auth, async (req, res) => {
  try {
    const projectData = req.body;
    const result = await masChainService.deployEscrowContract(projectData);
    
    res.json({
      success: true,
      message: 'Escrow contract deployment initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deploy escrow contract',
      error: error.message
    });
  }
});

// Callback Routes (for MasChain to notify us of status updates)
router.post('/wallet-callback', async (req, res) => {
  try {
    console.log('MasChain Wallet Callback:', req.body);
    // Handle wallet creation callback
    // Update database with wallet address, status, etc.
    
    res.json({ success: true, message: 'Callback received' });
  } catch (error) {
    console.error('Wallet callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/token-callback', async (req, res) => {
  try {
    console.log('MasChain Token Callback:', req.body);
    // Handle token creation/transfer callback
    
    res.json({ success: true, message: 'Callback received' });
  } catch (error) {
    console.error('Token callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/transfer-callback', async (req, res) => {
  try {
    console.log('MasChain Transfer Callback:', req.body);
    // Handle transfer callback
    
    res.json({ success: true, message: 'Callback received' });
  } catch (error) {
    console.error('Transfer callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc-callback', async (req, res) => {
  try {
    console.log('MasChain KYC Callback:', req.body);
    // Handle KYC status callback
    
    res.json({ success: true, message: 'Callback received' });
  } catch (error) {
    console.error('KYC callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/contract-callback', async (req, res) => {
  try {
    console.log('MasChain Contract Callback:', req.body);
    // Handle contract deployment callback
    
    res.json({ success: true, message: 'Callback received' });
  } catch (error) {
    console.error('Contract callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Utility Routes
router.get('/explorer/:txHash', (req, res) => {
  const { txHash } = req.params;
  const explorerURL = masChainService.getExplorerURL(txHash);
  res.redirect(explorerURL);
});

router.get('/portal', (req, res) => {
  const portalURL = masChainService.getPortalURL();
  res.redirect(portalURL);
});

module.exports = router;
