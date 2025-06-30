// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Simple FairLance Escrow Contract
 * @dev Simplified smart contract for managing freelance project escrows on MasChain
 */
contract SimpleFairLanceEscrow {
    
    enum ProjectStatus { 
        CREATED, 
        FUNDED, 
        IN_PROGRESS, 
        SUBMITTED, 
        COMPLETED, 
        CANCELLED 
    }
    
    struct Project {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        string title;
        string description;
        ProjectStatus status;
        uint256 createdAt;
        bool clientApproved;
        string deliverableHash; // IPFS hash for proof of work
    }
    
    // State variables
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public clientProjects;
    mapping(address => uint256[]) public freelancerProjects;
    
    uint256 public nextProjectId = 1;
    uint256 public platformFeePercent = 250; // 2.5% (250/10000)
    address public platformOwner;
    uint256 public totalEscrowAmount;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed client, address indexed freelancer, uint256 amount);
    event ProjectFunded(uint256 indexed projectId, uint256 amount);
    event ProjectStarted(uint256 indexed projectId);
    event WorkSubmitted(uint256 indexed projectId, string deliverableHash);
    event ProjectCompleted(uint256 indexed projectId, uint256 freelancerAmount, uint256 platformFee);
    event ProjectCancelled(uint256 indexed projectId);
    
    modifier onlyClient(uint256 _projectId) {
        require(msg.sender == projects[_projectId].client, "Only client can perform this action");
        _;
    }
    
    modifier onlyFreelancer(uint256 _projectId) {
        require(msg.sender == projects[_projectId].freelancer, "Only freelancer can perform this action");
        _;
    }
    
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Only platform owner can perform this action");
        _;
    }
    
    constructor() {
        platformOwner = msg.sender;
    }
    
    /**
     * @dev Create a new project with funding
     */
    function createProject(
        address _freelancer,
        string memory _title,
        string memory _description
    ) external payable returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(msg.value > 0, "Project amount must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        uint256 projectId = nextProjectId++;
        
        projects[projectId] = Project({
            id: projectId,
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            title: _title,
            description: _description,
            status: ProjectStatus.FUNDED,
            createdAt: block.timestamp,
            clientApproved: false,
            deliverableHash: ""
        });
        
        clientProjects[msg.sender].push(projectId);
        freelancerProjects[_freelancer].push(projectId);
        totalEscrowAmount += msg.value;
        
        emit ProjectCreated(projectId, msg.sender, _freelancer, msg.value);
        emit ProjectFunded(projectId, msg.value);
        
        return projectId;
    }
    
    /**
     * @dev Freelancer starts work on project
     */
    function startProject(uint256 _projectId) external onlyFreelancer(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.FUNDED, "Project not in funded state");
        
        project.status = ProjectStatus.IN_PROGRESS;
        
        emit ProjectStarted(_projectId);
    }
    
    /**
     * @dev Freelancer submits work with proof
     */
    function submitWork(
        uint256 _projectId, 
        string memory _deliverableHash
    ) external onlyFreelancer(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.IN_PROGRESS, "Project not in progress");
        require(bytes(_deliverableHash).length > 0, "Deliverable hash required");
        
        project.status = ProjectStatus.SUBMITTED;
        project.deliverableHash = _deliverableHash;
        
        emit WorkSubmitted(_projectId, _deliverableHash);
    }
    
    /**
     * @dev Client approves work and releases payment
     */
    function approveWork(uint256 _projectId) external onlyClient(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.SUBMITTED, "Work not submitted yet");
        
        project.status = ProjectStatus.COMPLETED;
        project.clientApproved = true;
        
        _releasePayment(_projectId);
    }
    
    /**
     * @dev Internal function to release payment
     */
    function _releasePayment(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        uint256 totalAmount = project.amount;
        uint256 platformFee = (totalAmount * platformFeePercent) / 10000;
        uint256 freelancerAmount = totalAmount - platformFee;
        
        totalEscrowAmount -= totalAmount;
        
        // Transfer payments
        payable(project.freelancer).transfer(freelancerAmount);
        payable(platformOwner).transfer(platformFee);
        
        emit ProjectCompleted(_projectId, freelancerAmount, platformFee);
    }
    
    /**
     * @dev Cancel project (only if not started)
     */
    function cancelProject(uint256 _projectId) external onlyClient(_projectId) {
        Project storage project = projects[_projectId];
        require(
            project.status == ProjectStatus.FUNDED,
            "Can only cancel funded projects"
        );
        
        project.status = ProjectStatus.CANCELLED;
        totalEscrowAmount -= project.amount;
        
        // Refund client
        payable(project.client).transfer(project.amount);
        
        emit ProjectCancelled(_projectId);
    }
    
    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }
    
    /**
     * @dev Get user's projects as client
     */
    function getClientProjects(address _client) external view returns (uint256[] memory) {
        return clientProjects[_client];
    }
    
    /**
     * @dev Get user's projects as freelancer
     */
    function getFreelancerProjects(address _freelancer) external view returns (uint256[] memory) {
        return freelancerProjects[_freelancer];
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyPlatformOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercent = _newFeePercent;
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get total number of projects
     */
    function getTotalProjects() external view returns (uint256) {
        return nextProjectId - 1;
    }
}
