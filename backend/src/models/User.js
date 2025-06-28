const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  
  // Profile Info
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  location: String,
  timezone: String,
  
  // User Type
  userType: {
    type: String,
    enum: ['freelancer', 'client', 'both'],
    default: 'both'
  },
  
  // Blockchain Integration
  walletAddress: String,
  masChainWalletId: String,
  masChainEntityId: String,
  
  // KYC Status
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not_started'],
    default: 'not_started'
  },
  kycId: String,
  kycData: {
    documentType: String,
    documentNumber: String,
    verificationDate: Date,
    expiryDate: Date
  },
  
  // Freelancer Specific
  skills: [String],
  hourlyRate: Number,
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'not-available'],
    default: 'part-time'
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String,
    technologies: [String]
  }],
  
  // Reputation & Trust
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  trustNFTs: [{
    certificateId: String,
    type: String,
    issuedDate: Date,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Skill Tokens
  skillTokens: [{
    tokenAddress: String,
    skill: String,
    level: Number,
    balance: Number,
    earnedDate: Date
  }],
  
  // Statistics
  stats: {
    projectsCompleted: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // in hours
    completionRate: { type: Number, default: 0 } // percentage
  },
  
  // Reviews
  reviews: [{
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  
  // Settings
  settings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ trustScore: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate trust score
userSchema.methods.calculateTrustScore = function() {
  const { projectsCompleted, averageRating, completionRate } = this.stats;
  
  // Base score from completed projects (max 30 points)
  const projectScore = Math.min(projectsCompleted * 2, 30);
  
  // Rating score (max 35 points)
  const ratingScore = (averageRating / 5) * 35;
  
  // Completion rate score (max 25 points)
  const completionScore = (completionRate / 100) * 25;
  
  // KYC bonus (10 points)
  const kycBonus = this.kycStatus === 'verified' ? 10 : 0;
  
  this.trustScore = Math.round(projectScore + ratingScore + completionScore + kycBonus);
  return this.trustScore;
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.email;
  delete user.kycData;
  return user;
};

module.exports = mongoose.model('User', userSchema);
