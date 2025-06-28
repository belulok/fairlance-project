'use client';

import { useContract, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Contract ABI (simplified for demo)
const ESCROW_ABI = [
  {
    "inputs": [
      {"name": "_freelancer", "type": "address"},
      {"name": "_title", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_deadline", "type": "uint256"},
      {"name": "_milestoneDescriptions", "type": "string[]"},
      {"name": "_milestoneAmounts", "type": "uint256[]"},
      {"name": "_milestoneDueDates", "type": "uint256[]"}
    ],
    "name": "createProject",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_projectId", "type": "uint256"}],
    "name": "startProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_projectId", "type": "uint256"},
      {"name": "_milestoneIndex", "type": "uint256"},
      {"name": "_deliverableHash", "type": "string"}
    ],
    "name": "submitMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_projectId", "type": "uint256"},
      {"name": "_milestoneIndex", "type": "uint256"}
    ],
    "name": "approveMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_projectId", "type": "uint256"}],
    "name": "getProject",
    "outputs": [
      {"name": "client", "type": "address"},
      {"name": "freelancer", "type": "address"},
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "totalAmount", "type": "uint256"},
      {"name": "status", "type": "uint8"},
      {"name": "createdAt", "type": "uint256"},
      {"name": "deadline", "type": "uint256"},
      {"name": "fundsDeposited", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextProjectId",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address (will be updated after deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useEscrowContract() {
  // Read contract data
  const { data: nextProjectId } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'nextProjectId',
  });

  // Create project function
  const { config: createProjectConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'createProject',
  });

  const { write: createProject, isLoading: isCreatingProject } = useContractWrite(createProjectConfig);

  // Start project function
  const { config: startProjectConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'startProject',
  });

  const { write: startProject, isLoading: isStartingProject } = useContractWrite(startProjectConfig);

  // Submit milestone function
  const { config: submitMilestoneConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'submitMilestone',
  });

  const { write: submitMilestone, isLoading: isSubmittingMilestone } = useContractWrite(submitMilestoneConfig);

  // Approve milestone function
  const { config: approveMilestoneConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'approveMilestone',
  });

  const { write: approveMilestone, isLoading: isApprovingMilestone } = useContractWrite(approveMilestoneConfig);

  // Get project details
  const getProject = (projectId: number) => {
    return useContractRead({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ESCROW_ABI,
      functionName: 'getProject',
      args: [BigInt(projectId)],
    });
  };

  // Helper functions
  const formatProjectData = (projectData: any) => {
    if (!projectData) return null;
    
    return {
      client: projectData[0],
      freelancer: projectData[1],
      title: projectData[2],
      description: projectData[3],
      totalAmount: formatEther(projectData[4]),
      status: projectData[5],
      createdAt: new Date(Number(projectData[6]) * 1000),
      deadline: new Date(Number(projectData[7]) * 1000),
      fundsDeposited: projectData[8],
    };
  };

  const createProjectWithMilestones = async (
    freelancerAddress: string,
    title: string,
    description: string,
    deadline: Date,
    milestones: Array<{
      description: string;
      amount: string; // in ETH
      dueDate: Date;
    }>
  ) => {
    if (!createProject) return;

    const milestoneDescriptions = milestones.map(m => m.description);
    const milestoneAmounts = milestones.map(m => parseEther(m.amount));
    const milestoneDueDates = milestones.map(m => BigInt(Math.floor(m.dueDate.getTime() / 1000)));
    const totalAmount = milestoneAmounts.reduce((sum, amount) => sum + amount, 0n);

    return createProject({
      args: [
        freelancerAddress as `0x${string}`,
        title,
        description,
        BigInt(Math.floor(deadline.getTime() / 1000)),
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDueDates,
      ],
      value: totalAmount,
    });
  };

  return {
    // Contract data
    nextProjectId: nextProjectId ? Number(nextProjectId) : 0,
    contractAddress: CONTRACT_ADDRESS,
    
    // Write functions
    createProject: createProjectWithMilestones,
    startProject,
    submitMilestone,
    approveMilestone,
    
    // Read functions
    getProject,
    formatProjectData,
    
    // Loading states
    isCreatingProject,
    isStartingProject,
    isSubmittingMilestone,
    isApprovingMilestone,
    
    // Contract ABI for external use
    abi: ESCROW_ABI,
  };
}
