const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Demo mode: Handle demo tokens
    if (token.startsWith('demo_token_')) {
      console.log('Demo mode: Using demo authentication');

      // Find or create a demo user
      let demoUser = await User.findOne({ username: 'demo_user' });
      if (!demoUser) {
        demoUser = new User({
          username: 'demo_user',
          email: 'demo@fairlance.demo',
          password: 'demo123456',
          firstName: 'Demo',
          lastName: 'User',
          userType: 'both',
          isVerified: true,
          kycStatus: 'not_started',
          trustScore: 75
        });
        await demoUser.save();
        console.log('Created demo user for KYC testing');
      }

      req.user = demoUser;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is verified
const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Account verification required',
      requiresVerification: true 
    });
  }
  next();
};

// Check if user has completed KYC
const requireKYC = (req, res, next) => {
  if (req.user.kycStatus !== 'verified') {
    return res.status(403).json({ 
      message: 'KYC verification required',
      requiresKYC: true,
      kycStatus: req.user.kycStatus
    });
  }
  next();
};

// Check user type
const requireUserType = (userType) => {
  return (req, res, next) => {
    if (req.user.userType !== userType && req.user.userType !== 'both') {
      return res.status(403).json({ 
        message: `Access denied. ${userType} account required.` 
      });
    }
    next();
  };
};

// Check if user owns resource
const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    const resourceId = req.params[resourceField] || req.body[resourceField];
    
    if (resourceId && resourceId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Resource ownership required.' });
    }
    next();
  };
};

// Rate limiting middleware
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    next();
  };
};

module.exports = {
  auth,
  requireVerified,
  requireKYC,
  requireUserType,
  requireOwnership,
  rateLimit
};
