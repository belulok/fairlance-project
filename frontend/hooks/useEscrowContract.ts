'use client';

import { useContract, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Contract ABI - Full ABI from deployment
const ESCROW_ABI = [
  {"type":"event","anonymous":false,"name":"DisputeRaised","inputs":[{"type":"uint256","name":"projectId","indexed":true},{"type":"address","name":"raiser","indexed":true}]},
  {"type":"event","anonymous":false,"name":"FundsDeposited","inputs":[{"type":"uint256","name":"projectId","indexed":true},{"type":"uint256","name":"amount","indexed":false}]},
  {"type":"event","anonymous":false,"name":"MilestoneApproved","inputs":[{"type":"uint256","name":"projectId","indexed":true},{"type":"uint256","name":"milestoneIndex","indexed":false},{"type":"uint256","name":"amount","indexed":false}]},
  {"type":"event","anonymous":false,"name":"MilestoneSubmitted","inputs":[{"type":"uint256","name":"projectId","indexed":true},{"type":"uint256","name":"milestoneIndex","indexed":false},{"type":"string","name":"deliverableHash","indexed":false}]},
  {"type":"event","anonymous":false,"name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","indexed":true},{"type":"address","name":"newOwner","indexed":true}]},
  {"type":"event","anonymous":false,"name":"ProjectCancelled","inputs":[{"type":"uint256","name":"projectId","indexed":true}]},
  {"type":"event","anonymous":false,"name":"ProjectCompleted","inputs":[{"type":"uint256","name":"projectId","indexed":true}]},
  {"type":"event","anonymous":false,"name":"ProjectCreated","inputs":[{"type":"uint256","name":"projectId","indexed":true},{"type":"address","name":"client","indexed":true},{"type":"address","name":"freelancer","indexed":true},{"type":"uint256","name":"totalAmount","indexed":false}]},
  {"type":"function","name":"approveMilestone","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"_projectId"},{"type":"uint256","name":"_milestoneIndex"}],"outputs":[]},
  {"type":"function","name":"cancelProject","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"_projectId"}],"outputs":[]},
  {"type":"function","name":"createProject","constant":false,"stateMutability":"payable","payable":true,"inputs":[{"type":"address","name":"_freelancer"},{"type":"string","name":"_title"},{"type":"string","name":"_description"},{"type":"uint256","name":"_deadline"},{"type":"string[]","name":"_milestoneDescriptions"},{"type":"uint256[]","name":"_milestoneAmounts"},{"type":"uint256[]","name":"_milestoneDueDates"}],"outputs":[{"type":"uint256"}]},
  {"type":"function","name":"getMilestone","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"_projectId"},{"type":"uint256","name":"_milestoneIndex"}],"outputs":[{"type":"string","name":"description"},{"type":"uint256","name":"amount"},{"type":"uint8","name":"status"},{"type":"string","name":"deliverableHash"},{"type":"uint256","name":"dueDate"}]},
  {"type":"function","name":"getMilestoneCount","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"_projectId"}],"outputs":[{"type":"uint256"}]},
  {"type":"function","name":"getProject","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"_projectId"}],"outputs":[{"type":"address","name":"client"},{"type":"address","name":"freelancer"},{"type":"string","name":"title"},{"type":"string","name":"description"},{"type":"uint256","name":"totalAmount"},{"type":"uint8","name":"status"},{"type":"uint256","name":"createdAt"},{"type":"uint256","name":"deadline"},{"type":"bool","name":"fundsDeposited"}]},
  {"type":"function","name":"nextProjectId","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"uint256"}]},
  {"type":"function","name":"owner","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"address"}]},
  {"type":"function","name":"platformFeePercent","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"uint256"}]},
  {"type":"function","name":"projects","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256"}],"outputs":[{"type":"address","name":"client"},{"type":"address","name":"freelancer"},{"type":"string","name":"title"},{"type":"string","name":"description"},{"type":"uint256","name":"totalAmount"},{"type":"uint8","name":"status"},{"type":"uint256","name":"createdAt"},{"type":"uint256","name":"deadline"},{"type":"bool","name":"fundsDeposited"}]},
  {"type":"function","name":"raiseDispute","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"_projectId"}],"outputs":[]},
  {"type":"function","name":"renounceOwnership","constant":false,"payable":false,"inputs":[],"outputs":[]},
  {"type":"function","name":"startProject","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"_projectId"}],"outputs":[]},
  {"type":"function","name":"submitMilestone","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"_projectId"},{"type":"uint256","name":"_milestoneIndex"},{"type":"string","name":"_deliverableHash"}],"outputs":[]},
  {"type":"function","name":"transferOwnership","constant":false,"payable":false,"inputs":[{"type":"address","name":"newOwner"}],"outputs":[]}
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
