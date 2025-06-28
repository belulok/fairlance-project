const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['development', 'design', 'marketing', 'security', 'writing', 'other']
  },
  
  // Client Info
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Project Details
  skills: [String],
  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USDC' }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedHours: Number
  },
  
  // Project Status
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'draft'
  },
  
  // Milestones
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'approved'],
      default: 'pending'
    },
    deliverables: [{
      type: String,
      description: String,
      fileUrl: String,
      githubHash: String,
      ipfsHash: String,
      submittedAt: Date
    }]
  }],
  
  // Escrow Integration
  escrowContract: {
    contractAddress: String,
    contractId: String,
    totalAmount: Number,
    releasedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['not_created', 'created', 'funded', 'released', 'disputed'],
      default: 'not_created'
    }
  },
  
  // Assigned Freelancer
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  
  // Proposals
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  
  // Requirements
  requirements: {
    experienceLevel: {
      type: String,
      enum: ['entry', 'intermediate', 'expert'],
      default: 'intermediate'
    },
    kycRequired: { type: Boolean, default: false },
    minimumTrustScore: { type: Number, default: 0 },
    preferredLocation: String,
    languageRequirements: [String]
  },
  
  // Proof of Work
  deliverables: [{
    milestone: String,
    type: {
      type: String,
      enum: ['github', 'ipfs', 'file', 'url']
    },
    hash: String,
    url: String,
    description: String,
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    feedback: String
  }],
  
  // Communication
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    attachments: [String]
  }],
  
  // Reviews & Ratings
  clientReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  },
  freelancerReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  },
  
  // Project Metadata
  tags: [String],
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  remote: { type: Boolean, default: true },
  
  // Analytics
  views: { type: Number, default: 0 },
  
  // Timestamps
  publishedAt: Date,
  completedAt: Date,
  
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ clientId: 1 });
projectSchema.index({ freelancerId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ 'budget.min': 1, 'budget.max': 1 });
projectSchema.index({ publishedAt: -1 });
projectSchema.index({ featured: -1, publishedAt: -1 });

// Virtual for proposal count
projectSchema.virtual('totalProposals', {
  ref: 'Proposal',
  localField: '_id',
  foreignField: 'projectId',
  count: true
});

// Methods
projectSchema.methods.canApply = function(userId) {
  // Check if user is not the client
  if (this.clientId.toString() === userId.toString()) {
    return false;
  }
  
  // Check if project is open
  if (this.status !== 'open') {
    return false;
  }
  
  // Check if user already applied
  // This would need to be checked against Proposal model
  
  return true;
};

projectSchema.methods.calculateProgress = function() {
  if (this.milestones.length === 0) return 0;
  
  const completedMilestones = this.milestones.filter(m => m.status === 'completed').length;
  return Math.round((completedMilestones / this.milestones.length) * 100);
};

projectSchema.methods.getTotalBudget = function() {
  return this.milestones.reduce((total, milestone) => total + (milestone.amount || 0), 0);
};

// Static methods
projectSchema.statics.findBySkills = function(skills) {
  return this.find({
    skills: { $in: skills },
    status: 'open'
  }).sort({ publishedAt: -1 });
};

projectSchema.statics.findFeatured = function() {
  return this.find({
    featured: true,
    status: 'open'
  }).sort({ publishedAt: -1 }).limit(10);
};

module.exports = mongoose.model('Project', projectSchema);
