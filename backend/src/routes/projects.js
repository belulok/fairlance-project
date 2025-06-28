const express = require('express');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const { auth, requireUserType, requireKYC } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      skills,
      minBudget,
      maxBudget,
      status = 'open',
      sort = 'newest',
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    const query = { status };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }
    
    if (minBudget || maxBudget) {
      query['budget.min'] = {};
      if (minBudget) query['budget.min'].$gte = Number(minBudget);
      if (maxBudget) query['budget.max'] = { $lte: Number(maxBudget) };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'budget-high':
        sortQuery = { 'budget.max': -1 };
        break;
      case 'budget-low':
        sortQuery = { 'budget.min': 1 };
        break;
      case 'deadline':
        sortQuery = { 'timeline.endDate': 1 };
        break;
      default: // newest
        sortQuery = { publishedAt: -1 };
    }

    // Execute query
    const projects = await Project.find(query)
      .populate('clientId', 'username firstName lastName avatar trustScore')
      .sort(sortQuery)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.findFeatured()
      .populate('clientId', 'username firstName lastName avatar trustScore');
    
    res.json({ projects });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'username firstName lastName avatar trustScore stats')
      .populate('freelancerId', 'username firstName lastName avatar trustScore stats');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Client)
router.post('/', auth, requireUserType('client'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      skills,
      budget,
      timeline,
      milestones,
      requirements
    } = req.body;

    // Validation
    if (!title || !description || !category || !budget) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const project = new Project({
      title,
      description,
      category,
      skills: skills || [],
      budget,
      timeline,
      milestones: milestones || [],
      requirements: requirements || {},
      clientId: req.user._id,
      status: 'draft'
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Project Owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Don't allow updates if project is in progress or completed
    if (['in_progress', 'completed'].includes(project.status)) {
      return res.status(400).json({ message: 'Cannot update project in current status' });
    }

    const allowedUpdates = [
      'title', 'description', 'category', 'skills', 'budget', 
      'timeline', 'milestones', 'requirements', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Set published date when status changes to open
    if (req.body.status === 'open' && project.status !== 'open') {
      project.publishedAt = new Date();
    }

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/apply
// @desc    Apply to project (create proposal)
// @access  Private (Freelancer)
router.post('/:id/apply', auth, requireUserType('freelancer'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.canApply(req.user._id)) {
      return res.status(400).json({ message: 'Cannot apply to this project' });
    }

    // Check if already applied
    const existingProposal = await Proposal.findOne({
      projectId: req.params.id,
      freelancerId: req.user._id
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }

    // Check KYC requirement
    if (project.requirements.kycRequired && req.user.kycStatus !== 'verified') {
      return res.status(403).json({ 
        message: 'KYC verification required for this project',
        requiresKYC: true 
      });
    }

    // Check minimum trust score
    if (project.requirements.minimumTrustScore && req.user.trustScore < project.requirements.minimumTrustScore) {
      return res.status(403).json({ 
        message: `Minimum trust score of ${project.requirements.minimumTrustScore} required`,
        currentTrustScore: req.user.trustScore
      });
    }

    const {
      coverLetter,
      proposedBudget,
      estimatedDuration,
      milestones,
      relevantExperience,
      portfolioItems,
      availability,
      additionalNotes
    } = req.body;

    if (!coverLetter || !proposedBudget) {
      return res.status(400).json({ message: 'Cover letter and proposed budget are required' });
    }

    const proposal = new Proposal({
      projectId: req.params.id,
      freelancerId: req.user._id,
      coverLetter,
      proposedBudget,
      estimatedDuration,
      milestones: milestones || [],
      relevantExperience,
      portfolioItems: portfolioItems || [],
      availability,
      additionalNotes
    });

    await proposal.save();

    // Note: Proposal count will be calculated via virtual field
    await project.save();

    res.status(201).json({
      message: 'Proposal submitted successfully',
      proposal
    });
  } catch (error) {
    console.error('Apply to project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id/proposals
// @desc    Get project proposals
// @access  Private (Project Owner)
router.get('/:id/proposals', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const proposals = await Proposal.findByProject(req.params.id, req.query.status);

    res.json({ proposals });
  } catch (error) {
    console.error('Get project proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
