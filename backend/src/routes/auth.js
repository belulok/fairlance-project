const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, rateLimit } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, userType } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Please provide email, password, and username' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      username,
      firstName,
      lastName,
      userType: userType || 'both'
    });

    await user.save();

    // Create MasChain wallet for user
    try {
      const walletResponse = await maschain.createWallet(user._id.toString(), 'user');
      user.masChainWalletId = walletResponse.wallet_id;
      user.walletAddress = walletResponse.wallet_address;
      user.masChainEntityId = user._id.toString();
      await user.save();
    } catch (error) {
      console.error('Failed to create MasChain wallet:', error);
      // Continue without wallet for now
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        walletAddress: user.walletAddress,
        kycStatus: user.kycStatus,
        trustScore: user.trustScore
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        walletAddress: user.walletAddress,
        kycStatus: user.kycStatus,
        trustScore: user.trustScore,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a more sophisticated setup, you might maintain a blacklist of tokens
    // For now, we'll just send a success response
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/connect-wallet
// @desc    Connect external wallet to account
// @access  Private
router.post('/connect-wallet', auth, async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    // TODO: Verify signature to ensure user owns the wallet
    // For now, we'll just update the wallet address

    const user = await User.findById(req.user._id);
    user.walletAddress = walletAddress;
    await user.save();

    res.json({
      message: 'Wallet connected successfully',
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
