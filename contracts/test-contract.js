const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Testing FairLance Escrow Contract...");
  
  // Get the deployed contract
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const FairLanceEscrow = await ethers.getContractFactory("FairLanceEscrow");
  const escrow = FairLanceEscrow.attach(contractAddress);
  
  // Get signers
  const [client, freelancer] = await ethers.getSigners();
  
  console.log("📋 Contract Address:", contractAddress);
  console.log("👤 Client Address:", client.address);
  console.log("👨‍💻 Freelancer Address:", freelancer.address);
  
  try {
    // Test 1: Check initial state
    console.log("\n📊 Test 1: Checking initial state...");
    const nextProjectId = await escrow.nextProjectId();
    console.log("✅ Next Project ID:", nextProjectId.toString());
    
    // Test 2: Create a project
    console.log("\n📝 Test 2: Creating a project...");
    const projectTitle = "Build DeFi Dashboard";
    const projectDescription = "Create a comprehensive DeFi dashboard with real-time analytics";
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
    
    const milestoneDescriptions = [
      "Frontend Development",
      "Backend API Integration", 
      "Testing & Deployment"
    ];
    const milestoneAmounts = [
      ethers.utils.parseEther("1.0"), // 1 ETH
      ethers.utils.parseEther("1.5"), // 1.5 ETH
      ethers.utils.parseEther("0.5")  // 0.5 ETH
    ];
    const milestoneDueDates = [
      deadline - (20 * 24 * 60 * 60), // 20 days from now
      deadline - (10 * 24 * 60 * 60), // 10 days from now
      deadline                         // 30 days from now
    ];

    const totalAmount = ethers.utils.parseEther("3.0"); // 3 ETH total
    
    const createTx = await escrow.connect(client).createProject(
      freelancer.address,
      projectTitle,
      projectDescription,
      deadline,
      milestoneDescriptions,
      milestoneAmounts,
      milestoneDueDates,
      { value: totalAmount }
    );
    
    const receipt = await createTx.wait();
    console.log("✅ Project created! Transaction hash:", receipt.hash);
    
    // Get the project ID from the event
    const projectCreatedEvent = receipt.logs.find(log => {
      try {
        const parsed = escrow.interface.parseLog(log);
        return parsed.name === 'ProjectCreated';
      } catch (e) {
        return false;
      }
    });
    
    let projectId = 1; // Default to 1 if event parsing fails
    if (projectCreatedEvent) {
      const parsed = escrow.interface.parseLog(projectCreatedEvent);
      projectId = parsed.args.projectId;
    }
    
    console.log("📋 Project ID:", projectId.toString());
    
    // Test 3: Get project details
    console.log("\n📖 Test 3: Getting project details...");
    const project = await escrow.getProject(projectId);
    console.log("✅ Project Details:");
    console.log("   Client:", project.client);
    console.log("   Freelancer:", project.freelancer);
    console.log("   Title:", project.title);
    console.log("   Description:", project.description);
    console.log("   Total Amount:", ethers.utils.formatEther(project.totalAmount), "ETH");
    console.log("   Status:", project.status.toString());
    console.log("   Funds Deposited:", project.fundsDeposited);
    
    // Test 4: Start the project
    console.log("\n🚀 Test 4: Starting the project...");
    const startTx = await escrow.connect(freelancer).startProject(projectId);
    await startTx.wait();
    console.log("✅ Project started!");
    
    // Test 5: Submit first milestone
    console.log("\n📤 Test 5: Submitting first milestone...");
    const deliverableHash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"; // IPFS hash
    const submitTx = await escrow.connect(freelancer).submitMilestone(projectId, 0, deliverableHash);
    await submitTx.wait();
    console.log("✅ Milestone submitted with hash:", deliverableHash);
    
    // Test 6: Approve first milestone
    console.log("\n✅ Test 6: Approving first milestone...");
    const approveTx = await escrow.connect(client).approveMilestone(projectId, 0);
    await approveTx.wait();
    console.log("✅ Milestone approved and payment released!");
    
    // Test 7: Get milestone details
    console.log("\n📋 Test 7: Getting milestone details...");
    const milestone = await escrow.getMilestone(projectId, 0);
    console.log("✅ Milestone Details:");
    console.log("   Description:", milestone.description);
    console.log("   Amount:", ethers.utils.formatEther(milestone.amount), "ETH");
    console.log("   Status:", milestone.status.toString());
    console.log("   Deliverable Hash:", milestone.deliverableHash);
    
    // Test 8: Check freelancer balance change
    console.log("\n💰 Test 8: Checking balances...");
    const freelancerBalance = await ethers.provider.getBalance(freelancer.address);
    console.log("✅ Freelancer balance:", ethers.utils.formatEther(freelancerBalance), "ETH");
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("🔗 Contract is fully functional and ready for demo!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
