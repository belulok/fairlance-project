const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying FairLance contracts to MasChain...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "MAS");
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.warn("⚠️  Low balance! You may need more MAS tokens for deployment.");
  }
  
  // Deploy FairLanceEscrow contract
  console.log("\n📄 Deploying FairLanceEscrow...");
  const FairLanceEscrow = await ethers.getContractFactory("FairLanceEscrow");
  
  // Deploy with constructor parameters if needed
  const escrow = await FairLanceEscrow.deploy();
  await escrow.deployed();
  
  console.log("✅ FairLanceEscrow deployed to:", escrow.address);
  console.log("🔗 Transaction hash:", escrow.deployTransaction.hash);
  
  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await escrow.deployTransaction.wait(3);
  
  // Deploy additional contracts if needed
  console.log("\n📄 Deploying additional contracts...");
  
  // Example: Deploy a token contract for payments
  const FairLanceToken = await ethers.getContractFactory("FairLanceToken");
  const token = await FairLanceToken.deploy("FairLance Token", "FLT", ethers.utils.parseEther("1000000"));
  await token.deployed();
  
  console.log("✅ FairLanceToken deployed to:", token.address);
  
  // Save deployment info
  const deploymentInfo = {
    network: "MasChain Testnet",
    chainId: 1337,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      FairLanceEscrow: {
        address: escrow.address,
        transactionHash: escrow.deployTransaction.hash,
        blockNumber: escrow.deployTransaction.blockNumber
      },
      FairLanceToken: {
        address: token.address,
        transactionHash: token.deployTransaction.hash,
        blockNumber: token.deployTransaction.blockNumber
      }
    },
    gasUsed: {
      escrow: (await escrow.deployTransaction.wait()).gasUsed.toString(),
      token: (await token.deployTransaction.wait()).gasUsed.toString()
    }
  };
  
  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, 'maschain-deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Summary:");
  console.log("  • Network: MasChain Testnet");
  console.log("  • Escrow Contract:", escrow.address);
  console.log("  • Token Contract:", token.address);
  console.log("  • Deployer:", deployer.address);
  console.log("  • Deployment file: deployments/maschain-deployment.json");
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update frontend environment variables:");
  console.log(`   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${escrow.address}`);
  console.log(`   NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=${token.address}`);
  console.log("2. Verify contracts on MasChain explorer (if available)");
  console.log("3. Test contract interactions");
  
  return {
    escrow: escrow.address,
    token: token.address
  };
}

// Execute deployment
main()
  .then((addresses) => {
    console.log("\n✅ All contracts deployed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
