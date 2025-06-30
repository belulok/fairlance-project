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

// Wallet Management Routes - MasChain server-side wallet creation
router.post('/wallet/create', async (req, res) => {
  try {
    const { name, email, phone, ic, walletName } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const userData = {
      name,
      email,
      phone,
      ic,
      walletName: walletName || `${name}_FairLance_Wallet`
    };

    const result = await masChainService.createMasChainWallet(userData);

    res.json({
      success: true,
      message: 'MasChain wallet created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create MasChain wallet',
      error: error.message
    });
  }
});

router.get('/wallet/balance/:walletId', async (req, res) => {
  try {
    const { walletId } = req.params;
    const result = await masChainService.getMasChainWalletBalance(walletId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
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

router.post('/token/mint', async (req, res) => {
  try {
    const { walletId, amount, tokenContract } = req.body;

    // For demo purposes, we'll use a default token contract
    const defaultTokenContract = '0x6326aFF363CcCdF4404450c24B48b926dDCeC88C';

    const result = await masChainService.mintToken(
      walletId,
      walletId, // mint to same wallet
      tokenContract || defaultTokenContract,
      amount
    );

    res.json({
      success: true,
      message: 'Token minting initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mint tokens',
      error: error.message
    });
  }
});

router.post('/token/transfer', async (req, res) => {
  try {
    const { fromWalletId, toAddress, amount, tokenContract } = req.body;

    const defaultTokenContract = '0x6326aFF363CcCdF4404450c24B48b926dDCeC88C';

    const result = await masChainService.transferToken(
      fromWalletId,
      toAddress,
      tokenContract || defaultTokenContract,
      amount
    );

    res.json({
      success: true,
      message: 'Token transfer initiated',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to transfer tokens',
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

router.post('/deployment-callback', async (req, res) => {
  try {
    console.log('🎉 MasChain Deployment Callback:', JSON.stringify(req.body, null, 2));

    const { status, message, deployment_id, deployed_contract_addresses } = req.body;

    // Update deployment info file
    const fs = require('fs');
    const path = require('path');
    const deploymentInfoPath = path.join(__dirname, '../deployment-info.json');

    if (fs.existsSync(deploymentInfoPath)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));

      deploymentInfo.status = status;
      deploymentInfo.message = message;
      deploymentInfo.completedAt = new Date().toISOString();

      if (status === 'Completed' && deployed_contract_addresses && deployed_contract_addresses.length > 0) {
        const contractInfo = deployed_contract_addresses[0];
        deploymentInfo.contractAddress = contractInfo.contract_address;
        deploymentInfo.transactionHash = contractInfo.receipt.transactionHash;
        deploymentInfo.blockNumber = contractInfo.receipt.blockNumber;
        deploymentInfo.gasUsed = contractInfo.receipt.gasUsed;

        console.log('🎊 Contract deployed successfully!');
        console.log(`📋 Contract Address: ${contractInfo.contract_address}`);
        console.log(`🔗 Transaction Hash: ${contractInfo.receipt.transactionHash}`);
        console.log(`🌐 Explorer: https://explorer-testnet.maschain.com/tx/${contractInfo.receipt.transactionHash}`);
      }

      fs.writeFileSync(deploymentInfoPath, JSON.stringify(deploymentInfo, null, 2));
    }

    res.json({ success: true, message: 'Deployment callback processed' });
  } catch (error) {
    console.error('Deployment callback error:', error);
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
