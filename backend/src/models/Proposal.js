const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  // Basic Info
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Proposal Details
  coverLetter: {
    type: String,
    required: true
  },
  proposedBudget: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USDC' }
  },
  estimatedDuration: {
    value: Number,
    unit: { type: String, enum: ['hours', 'days', 'weeks', 'months'] }
  },
  
  // Milestone Breakdown
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    estimatedDays: Number,
    deliverables: [String]
  }],
  
  // Portfolio & Experience
  relevantExperience: String,
  portfolioItems: [{
    title: String,
    description: String,
    url: String,
    imageUrl: String,
    technologies: [String]
  }],
  
  // Proposal Status
  status: {
    type: String,
    enum: ['submitted', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted'
  },
  
  // Client Interaction
  clientQuestions: [{
    question: String,
    answer: String,
    askedAt: { type: Date, default: Date.now },
    answeredAt: Date
  }],
  
  // Freelancer Availability
  availability: {
    hoursPerWeek: Number,
    startDate: Date,
    timezone: String
  },
  
  // Additional Info
  additionalNotes: String,
  attachments: [String],
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  viewedAt: Date,
  respondedAt: Date,
  
}, {
  timestamps: true
});

// Indexes
proposalSchema.index({ projectId: 1 });
proposalSchema.index({ freelancerId: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ submittedAt: -1 });

// Compound indexes
proposalSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });
proposalSchema.index({ projectId: 1, status: 1 });

// Methods
proposalSchema.methods.canWithdraw = function() {
  return ['submitted', 'viewed'].includes(this.status);
};

proposalSchema.methods.markAsViewed = function() {
  if (this.status === 'submitted') {
    this.status = 'viewed';
    this.viewedAt = new Date();
  }
};

// Static methods
proposalSchema.statics.findByProject = function(projectId, status = null) {
  const query = { projectId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('freelancerId', 'username firstName lastName avatar trustScore stats')
    .sort({ submittedAt: -1 });
};

proposalSchema.statics.findByFreelancer = function(freelancerId, status = null) {
  const query = { freelancerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('projectId', 'title description budget status clientId')
    .sort({ submittedAt: -1 });
};

module.exports = mongoose.model('Proposal', proposalSchema);
