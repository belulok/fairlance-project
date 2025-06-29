const express = require('express');
const router = express.Router();
const demoProjects = require('../seeders/demoProjects');

// Get all demo projects
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Demo projects retrieved successfully',
      data: demoProjects,
      count: demoProjects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo projects',
      error: error.message
    });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = demoProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
});

// Get projects by status
router.get('/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    const filteredProjects = demoProjects.filter(p => p.status === status);
    
    res.json({
      success: true,
      data: filteredProjects,
      count: filteredProjects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to filter projects',
      error: error.message
    });
  }
});

// Get projects by category
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const filteredProjects = demoProjects.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredProjects,
      count: filteredProjects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to filter projects by category',
      error: error.message
    });
  }
});

// Get blockchain statistics
router.get('/stats/blockchain', (req, res) => {
  try {
    const stats = {
      totalProjects: demoProjects.length,
      totalValueLocked: demoProjects.reduce((sum, p) => sum + p.budget.amount, 0),
      totalReleased: demoProjects.reduce((sum, p) => sum + p.blockchain.released, 0),
      totalPending: demoProjects.reduce((sum, p) => sum + p.blockchain.pending, 0),
      activeContracts: demoProjects.filter(p => p.status === 'in_progress').length,
      completedMilestones: demoProjects.reduce((sum, p) => 
        sum + p.milestones.filter(m => m.status === 'completed').length, 0
      ),
      totalTransactions: demoProjects.reduce((sum, p) => 
        sum + p.blockchain.transactions.length, 0
      ),
      averageProjectValue: demoProjects.reduce((sum, p) => sum + p.budget.amount, 0) / demoProjects.length,
      kycVerifiedFreelancers: demoProjects.filter(p => p.freelancer.kycVerified).length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate blockchain statistics',
      error: error.message
    });
  }
});

// Get proof of work data
router.get('/:id/proof-of-work', (req, res) => {
  try {
    const { id } = req.params;
    const project = demoProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const proofOfWork = project.milestones
      .filter(m => m.proofOfWork)
      .map(m => ({
        milestoneId: m.id,
        milestoneTitle: m.title,
        status: m.status,
        completedAt: m.completedAt,
        proofOfWork: m.proofOfWork
      }));
    
    res.json({
      success: true,
      data: {
        projectId: project.id,
        projectTitle: project.title,
        freelancer: project.freelancer.name,
        proofOfWork
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve proof of work',
      error: error.message
    });
  }
});

module.exports = router;
