const express = require('express');
const Project = require('../models/Project');
const { auth, requireKYC } = require('../middleware/auth');
const maschain = require('../services/maschain');

const router = express.Router();

// Escrow Smart Contract Template
const ESCROW_CONTRACT_CODE = `
pragma solidity ^0.8.0;

contract FairLanceEscrow {
    address public client;
    address public freelancer;
    uint256 public totalAmount;
    uint256 public releasedAmount;
    bool public isCompleted;
    bool public isDisputed;
    
    struct Milestone {
        uint256 amount;
        bool isCompleted;
        bool isApproved;
        string deliverableHash;
    }
    
    mapping(uint256 => Milestone) public milestones;
    uint256 public milestoneCount;
    
    event FundsDeposited(uint256 amount);
    event MilestoneCompleted(uint256 milestoneId, string deliverableHash);
    event MilestoneApproved(uint256 milestoneId, uint256 amount);
    event FundsReleased(uint256 amount);
    event DisputeRaised();
    
    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this");
        _;
    }
    
    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this");
        _;
    }
    
    constructor(address _freelancer, uint256[] memory _milestoneAmounts) {
        client = msg.sender;
        freelancer = _freelancer;
        
        for(uint i = 0; i < _milestoneAmounts.length; i++) {
            milestones[i] = Milestone({
                amount: _milestoneAmounts[i],
                isCompleted: false,
                isApproved: false,
                deliverableHash: ""
            });
            totalAmount += _milestoneAmounts[i];
        }
        milestoneCount = _milestoneAmounts.length;
    }
    
    function depositFunds() external payable onlyClient {
        require(msg.value == totalAmount, "Must deposit exact total amount");
        emit FundsDeposited(msg.value);
    }
    
    function submitMilestone(uint256 _milestoneId, string memory _deliverableHash) external onlyFreelancer {
        require(_milestoneId < milestoneCount, "Invalid milestone ID");
        require(!milestones[_milestoneId].isCompleted, "Milestone already completed");
        
        milestones[_milestoneId].isCompleted = true;
        milestones[_milestoneId].deliverableHash = _deliverableHash;
        
        emit MilestoneCompleted(_milestoneId, _deliverableHash);
    }
    
    function approveMilestone(uint256 _milestoneId) external onlyClient {
        require(_milestoneId < milestoneCount, "Invalid milestone ID");
        require(milestones[_milestoneId].isCompleted, "Milestone not completed");
        require(!milestones[_milestoneId].isApproved, "Milestone already approved");
        
        milestones[_milestoneId].isApproved = true;
        uint256 amount = milestones[_milestoneId].amount;
        releasedAmount += amount;
        
        payable(freelancer).transfer(amount);
        
        emit MilestoneApproved(_milestoneId, amount);
        emit FundsReleased(amount);
        
        // Check if all milestones are completed
        bool allCompleted = true;
        for(uint i = 0; i < milestoneCount; i++) {
            if(!milestones[i].isApproved) {
                allCompleted = false;
                break;
            }
        }
        if(allCompleted) {
            isCompleted = true;
        }
    }
    
    function raiseDispute() external {
        require(msg.sender == client || msg.sender == freelancer, "Only parties can raise dispute");
        isDisputed = true;
        emit DisputeRaised();
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
`;

// @route   POST /api/escrow/create
// @desc    Create escrow contract for project
// @access  Private (Client)
router.post('/create', auth, requireKYC, async (req, res) => {
  try {
    const { projectId, milestoneAmounts } = req.body;

    if (!projectId || !milestoneAmounts || !Array.isArray(milestoneAmounts)) {
      return res.status(400).json({ message: 'Project ID and milestone amounts required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if project has assigned freelancer
    if (!project.freelancerId) {
      return res.status(400).json({ message: 'Project must have assigned freelancer' });
    }

    // Check if escrow already exists
    if (project.escrowContract.contractAddress) {
      return res.status(400).json({ message: 'Escrow contract already exists' });
    }

    try {
      // Deploy escrow contract via MasChain
      const contractResponse = await maschain.deployContract({
        name: `FairLanceEscrow_${projectId}`,
        code: ESCROW_CONTRACT_CODE,
        constructorParams: [
          project.freelancerId.toString(), // freelancer address (will be mapped to wallet)
          milestoneAmounts
        ],
        metadata: {
          projectId,
          clientId: project.clientId.toString(),
          freelancerId: project.freelancerId.toString(),
          totalAmount: milestoneAmounts.reduce((sum, amount) => sum + amount, 0)
        }
      });

      // Update project with escrow details
      project.escrowContract = {
        contractAddress: contractResponse.contract_address,
        contractId: contractResponse.contract_id,
        totalAmount: milestoneAmounts.reduce((sum, amount) => sum + amount, 0),
        status: 'created'
      };

      await project.save();

      // Create audit trail
      await maschain.createAuditRecord({
        entityId: project._id.toString(),
        action: 'ESCROW_CREATED',
        metadata: {
          contractAddress: contractResponse.contract_address,
          totalAmount: project.escrowContract.totalAmount,
          milestoneCount: milestoneAmounts.length
        },
        hash: contractResponse.transaction_hash,
        timestamp: new Date()
      });

      res.status(201).json({
        message: 'Escrow contract created successfully',
        contract: {
          address: contractResponse.contract_address,
          id: contractResponse.contract_id,
          totalAmount: project.escrowContract.totalAmount,
          status: 'created'
        }
      });
    } catch (error) {
      console.error('MasChain contract deployment error:', error);
      res.status(500).json({ message: 'Failed to deploy escrow contract' });
    }
  } catch (error) {
    console.error('Create escrow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/escrow/:projectId/fund
// @desc    Fund escrow contract
// @access  Private (Client)
router.post('/:projectId/fund', auth, requireKYC, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!project.escrowContract.contractAddress) {
      return res.status(400).json({ message: 'No escrow contract found' });
    }

    if (project.escrowContract.status === 'funded') {
      return res.status(400).json({ message: 'Contract already funded' });
    }

    try {
      // Call depositFunds method on the contract
      const fundResponse = await maschain.callContract(
        project.escrowContract.contractAddress,
        'depositFunds',
        [],
        req.user.walletAddress
      );

      // Update project status
      project.escrowContract.status = 'funded';
      project.status = 'in_progress';
      await project.save();

      // Create audit trail
      await maschain.createAuditRecord({
        entityId: project._id.toString(),
        action: 'ESCROW_FUNDED',
        metadata: {
          contractAddress: project.escrowContract.contractAddress,
          amount: project.escrowContract.totalAmount,
          transactionHash: fundResponse.transaction_hash
        },
        hash: fundResponse.transaction_hash,
        timestamp: new Date()
      });

      res.json({
        message: 'Escrow contract funded successfully',
        transactionHash: fundResponse.transaction_hash
      });
    } catch (error) {
      console.error('MasChain funding error:', error);
      res.status(500).json({ message: 'Failed to fund escrow contract' });
    }
  } catch (error) {
    console.error('Fund escrow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/escrow/:projectId/submit-milestone
// @desc    Submit milestone deliverable
// @access  Private (Freelancer)
router.post('/:projectId/submit-milestone', auth, requireKYC, async (req, res) => {
  try {
    const { milestoneId, deliverableHash, description } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is assigned freelancer
    if (project.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!project.escrowContract.contractAddress) {
      return res.status(400).json({ message: 'No escrow contract found' });
    }

    if (!deliverableHash) {
      return res.status(400).json({ message: 'Deliverable hash required' });
    }

    try {
      // Call submitMilestone method on the contract
      const submitResponse = await maschain.callContract(
        project.escrowContract.contractAddress,
        'submitMilestone',
        [milestoneId, deliverableHash],
        req.user.walletAddress
      );

      // Update project milestone
      if (project.milestones[milestoneId]) {
        project.milestones[milestoneId].status = 'completed';
        project.milestones[milestoneId].deliverables.push({
          type: 'hash',
          hash: deliverableHash,
          description,
          submittedAt: new Date()
        });
      }

      await project.save();

      // Create audit trail
      await maschain.createAuditRecord({
        entityId: project._id.toString(),
        action: 'MILESTONE_SUBMITTED',
        metadata: {
          milestoneId,
          deliverableHash,
          description,
          transactionHash: submitResponse.transaction_hash
        },
        hash: deliverableHash,
        timestamp: new Date()
      });

      res.json({
        message: 'Milestone submitted successfully',
        transactionHash: submitResponse.transaction_hash
      });
    } catch (error) {
      console.error('MasChain milestone submission error:', error);
      res.status(500).json({ message: 'Failed to submit milestone' });
    }
  } catch (error) {
    console.error('Submit milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/escrow/:projectId/approve-milestone
// @desc    Approve milestone and release funds
// @access  Private (Client)
router.post('/:projectId/approve-milestone', auth, requireKYC, async (req, res) => {
  try {
    const { milestoneId } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!project.escrowContract.contractAddress) {
      return res.status(400).json({ message: 'No escrow contract found' });
    }

    try {
      // Call approveMilestone method on the contract
      const approveResponse = await maschain.callContract(
        project.escrowContract.contractAddress,
        'approveMilestone',
        [milestoneId],
        req.user.walletAddress
      );

      // Update project milestone
      if (project.milestones[milestoneId]) {
        project.milestones[milestoneId].status = 'approved';
        const milestoneAmount = project.milestones[milestoneId].amount;
        project.escrowContract.releasedAmount += milestoneAmount;
      }

      await project.save();

      // Create audit trail
      await maschain.createAuditRecord({
        entityId: project._id.toString(),
        action: 'MILESTONE_APPROVED',
        metadata: {
          milestoneId,
          amount: project.milestones[milestoneId]?.amount,
          transactionHash: approveResponse.transaction_hash
        },
        hash: approveResponse.transaction_hash,
        timestamp: new Date()
      });

      res.json({
        message: 'Milestone approved and funds released',
        transactionHash: approveResponse.transaction_hash
      });
    } catch (error) {
      console.error('MasChain milestone approval error:', error);
      res.status(500).json({ message: 'Failed to approve milestone' });
    }
  } catch (error) {
    console.error('Approve milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/escrow/:projectId/status
// @desc    Get escrow contract status
// @access  Private (Project participants)
router.get('/:projectId/status', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is participant
    const isParticipant = project.clientId.toString() === req.user._id.toString() ||
                         project.freelancerId?.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!project.escrowContract.contractAddress) {
      return res.status(404).json({ message: 'No escrow contract found' });
    }

    try {
      // Get contract state from MasChain
      const contractState = await maschain.getContractState(project.escrowContract.contractAddress);

      res.json({
        contract: {
          address: project.escrowContract.contractAddress,
          status: project.escrowContract.status,
          totalAmount: project.escrowContract.totalAmount,
          releasedAmount: project.escrowContract.releasedAmount,
          balance: contractState.balance,
          milestones: project.milestones
        }
      });
    } catch (error) {
      console.error('MasChain contract state error:', error);
      res.status(500).json({ message: 'Failed to get contract status' });
    }
  } catch (error) {
    console.error('Get escrow status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
