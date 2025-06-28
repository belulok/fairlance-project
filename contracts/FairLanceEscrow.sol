// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FairLanceEscrow
 * @dev Smart contract for freelance project escrow with milestone-based payments
 */
contract FairLanceEscrow is ReentrancyGuard, Ownable {
    
    enum ProjectStatus { Created, InProgress, Completed, Disputed, Cancelled }
    enum MilestoneStatus { Pending, Submitted, Approved, Disputed }
    
    struct Milestone {
        string description;
        uint256 amount;
        MilestoneStatus status;
        string deliverableHash; // IPFS hash or GitHub commit
        uint256 dueDate;
    }
    
    struct Project {
        address client;
        address freelancer;
        string title;
        string description;
        uint256 totalAmount;
        ProjectStatus status;
        uint256 createdAt;
        uint256 deadline;
        Milestone[] milestones;
        bool fundsDeposited;
    }
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 totalAmount);
    event FundsDeposited(uint256 indexed projectId, uint256 amount);
    event MilestoneSubmitted(uint256 indexed projectId, uint256 milestoneIndex, string deliverableHash);
    event MilestoneApproved(uint256 indexed projectId, uint256 milestoneIndex, uint256 amount);
    event ProjectCompleted(uint256 indexed projectId);
    event DisputeRaised(uint256 indexed projectId, address indexed raiser);
    event ProjectCancelled(uint256 indexed projectId);
    
    // State variables
    mapping(uint256 => Project) public projects;
    uint256 public nextProjectId;
    uint256 public platformFeePercent = 0; // 0% fees - our competitive advantage!
    
    // Modifiers
    modifier onlyClient(uint256 _projectId) {
        require(projects[_projectId].client == msg.sender, "Only client can call this");
        _;
    }
    
    modifier onlyFreelancer(uint256 _projectId) {
        require(projects[_projectId].freelancer == msg.sender, "Only freelancer can call this");
        _;
    }
    
    modifier onlyProjectParties(uint256 _projectId) {
        require(
            projects[_projectId].client == msg.sender || 
            projects[_projectId].freelancer == msg.sender,
            "Only project parties can call this"
        );
        _;
    }
    
    modifier projectExists(uint256 _projectId) {
        require(_projectId < nextProjectId, "Project does not exist");
        _;
    }
    
    /**
     * @dev Create a new freelance project with milestones
     */
    function createProject(
        address _freelancer,
        string memory _title,
        string memory _description,
        uint256 _deadline,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts,
        uint256[] memory _milestoneDueDates
    ) external payable returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(_milestoneDescriptions.length == _milestoneAmounts.length, "Milestone arrays length mismatch");
        require(_milestoneDescriptions.length == _milestoneDueDates.length, "Milestone arrays length mismatch");
        require(_milestoneDescriptions.length > 0, "At least one milestone required");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            totalAmount += _milestoneAmounts[i];
        }
        
        require(msg.value == totalAmount, "Sent value must equal total milestone amounts");
        
        uint256 projectId = nextProjectId++;
        
        Project storage newProject = projects[projectId];
        newProject.client = msg.sender;
        newProject.freelancer = _freelancer;
        newProject.title = _title;
        newProject.description = _description;
        newProject.totalAmount = totalAmount;
        newProject.status = ProjectStatus.Created;
        newProject.createdAt = block.timestamp;
        newProject.deadline = _deadline;
        newProject.fundsDeposited = true;
        
        // Add milestones
        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newProject.milestones.push(Milestone({
                description: _milestoneDescriptions[i],
                amount: _milestoneAmounts[i],
                status: MilestoneStatus.Pending,
                deliverableHash: "",
                dueDate: _milestoneDueDates[i]
            }));
        }
        
        emit ProjectCreated(projectId, msg.sender, _freelancer, totalAmount);
        emit FundsDeposited(projectId, totalAmount);
        
        return projectId;
    }
    
    /**
     * @dev Freelancer starts working on the project
     */
    function startProject(uint256 _projectId) 
        external 
        onlyFreelancer(_projectId) 
        projectExists(_projectId) 
    {
        require(projects[_projectId].status == ProjectStatus.Created, "Project not in created status");
        require(projects[_projectId].fundsDeposited, "Funds not deposited");
        
        projects[_projectId].status = ProjectStatus.InProgress;
    }
    
    /**
     * @dev Submit milestone deliverable (IPFS hash or GitHub commit)
     */
    function submitMilestone(
        uint256 _projectId, 
        uint256 _milestoneIndex, 
        string memory _deliverableHash
    ) 
        external 
        onlyFreelancer(_projectId) 
        projectExists(_projectId) 
    {
        require(projects[_projectId].status == ProjectStatus.InProgress, "Project not in progress");
        require(_milestoneIndex < projects[_projectId].milestones.length, "Invalid milestone index");
        require(projects[_projectId].milestones[_milestoneIndex].status == MilestoneStatus.Pending, "Milestone not pending");
        require(bytes(_deliverableHash).length > 0, "Deliverable hash required");
        
        projects[_projectId].milestones[_milestoneIndex].status = MilestoneStatus.Submitted;
        projects[_projectId].milestones[_milestoneIndex].deliverableHash = _deliverableHash;
        
        emit MilestoneSubmitted(_projectId, _milestoneIndex, _deliverableHash);
    }
    
    /**
     * @dev Client approves milestone and releases payment
     */
    function approveMilestone(uint256 _projectId, uint256 _milestoneIndex) 
        external 
        onlyClient(_projectId) 
        projectExists(_projectId) 
        nonReentrant 
    {
        require(_milestoneIndex < projects[_projectId].milestones.length, "Invalid milestone index");
        require(projects[_projectId].milestones[_milestoneIndex].status == MilestoneStatus.Submitted, "Milestone not submitted");
        
        Milestone storage milestone = projects[_projectId].milestones[_milestoneIndex];
        milestone.status = MilestoneStatus.Approved;
        
        uint256 paymentAmount = milestone.amount;
        
        // Transfer payment to freelancer (0% platform fee!)
        (bool success, ) = projects[_projectId].freelancer.call{value: paymentAmount}("");
        require(success, "Payment transfer failed");
        
        emit MilestoneApproved(_projectId, _milestoneIndex, paymentAmount);
        
        // Check if all milestones are approved
        bool allApproved = true;
        for (uint256 i = 0; i < projects[_projectId].milestones.length; i++) {
            if (projects[_projectId].milestones[i].status != MilestoneStatus.Approved) {
                allApproved = false;
                break;
            }
        }
        
        if (allApproved) {
            projects[_projectId].status = ProjectStatus.Completed;
            emit ProjectCompleted(_projectId);
        }
    }
    
    /**
     * @dev Raise a dispute (simplified version)
     */
    function raiseDispute(uint256 _projectId) 
        external 
        onlyProjectParties(_projectId) 
        projectExists(_projectId) 
    {
        require(projects[_projectId].status == ProjectStatus.InProgress, "Project not in progress");
        
        projects[_projectId].status = ProjectStatus.Disputed;
        emit DisputeRaised(_projectId, msg.sender);
    }
    
    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            address client,
            address freelancer,
            string memory title,
            string memory description,
            uint256 totalAmount,
            ProjectStatus status,
            uint256 createdAt,
            uint256 deadline,
            bool fundsDeposited
        ) 
    {
        Project storage project = projects[_projectId];
        return (
            project.client,
            project.freelancer,
            project.title,
            project.description,
            project.totalAmount,
            project.status,
            project.createdAt,
            project.deadline,
            project.fundsDeposited
        );
    }
    
    /**
     * @dev Get milestone details
     */
    function getMilestone(uint256 _projectId, uint256 _milestoneIndex) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            string memory description,
            uint256 amount,
            MilestoneStatus status,
            string memory deliverableHash,
            uint256 dueDate
        ) 
    {
        require(_milestoneIndex < projects[_projectId].milestones.length, "Invalid milestone index");
        Milestone storage milestone = projects[_projectId].milestones[_milestoneIndex];
        return (
            milestone.description,
            milestone.amount,
            milestone.status,
            milestone.deliverableHash,
            milestone.dueDate
        );
    }
    
    /**
     * @dev Get number of milestones for a project
     */
    function getMilestoneCount(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (uint256) 
    {
        return projects[_projectId].milestones.length;
    }
    
    /**
     * @dev Emergency cancel project (only before freelancer starts)
     */
    function cancelProject(uint256 _projectId) 
        external 
        onlyClient(_projectId) 
        projectExists(_projectId) 
        nonReentrant 
    {
        require(projects[_projectId].status == ProjectStatus.Created, "Can only cancel created projects");
        
        projects[_projectId].status = ProjectStatus.Cancelled;
        
        // Refund client
        uint256 refundAmount = projects[_projectId].totalAmount;
        (bool success, ) = projects[_projectId].client.call{value: refundAmount}("");
        require(success, "Refund transfer failed");
        
        emit ProjectCancelled(_projectId);
    }
}
