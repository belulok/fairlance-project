const express = require('express');
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/proposals/my
// @desc    Get user's proposals
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const proposals = await Proposal.findByFreelancer(req.user._id, req.query.status);
    res.json({ proposals });
  } catch (error) {
    console.error('Get my proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/proposals/:id
// @desc    Update proposal
// @access  Private (Proposal owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!proposal.canWithdraw()) {
      return res.status(400).json({ message: 'Cannot modify proposal in current status' });
    }

    const allowedUpdates = [
      'coverLetter', 'proposedBudget', 'estimatedDuration', 
      'milestones', 'relevantExperience', 'portfolioItems', 
      'availability', 'additionalNotes'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        proposal[field] = req.body[field];
      }
    });

    await proposal.save();

    res.json({
      message: 'Proposal updated successfully',
      proposal
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/proposals/:id
// @desc    Withdraw proposal
// @access  Private (Proposal owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!proposal.canWithdraw()) {
      return res.status(400).json({ message: 'Cannot withdraw proposal in current status' });
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    res.json({ message: 'Proposal withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw proposal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
