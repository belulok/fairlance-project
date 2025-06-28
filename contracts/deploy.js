const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying FairLance Smart Contracts...');

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying contracts with account:', deployer.address);
  console.log('💰 Account balance:', ethers.utils.formatEther(await deployer.getBalance()), 'ETH');

  // Deploy FairLanceEscrow contract
  console.log('\n📄 Deploying FairLanceEscrow...');
  const FairLanceEscrow = await ethers.getContractFactory('FairLanceEscrow');
  const escrow = await FairLanceEscrow.deploy();
  await escrow.deployed();

  console.log('✅ FairLanceEscrow deployed to:', escrow.address);
  console.log('🔗 Transaction hash:', escrow.deployTransaction.hash);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  const nextProjectId = await escrow.nextProjectId();
  const platformFee = await escrow.platformFeePercent();
  
  console.log('📊 Contract state:');
  console.log('   - Next Project ID:', nextProjectId.toString());
  console.log('   - Platform Fee:', platformFee.toString() + '%');

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    contractAddress: escrow.address,
    deployerAddress: deployer.address,
    transactionHash: escrow.deployTransaction.hash,
    blockNumber: escrow.deployTransaction.blockNumber,
    deployedAt: new Date().toISOString(),
    abi: FairLanceEscrow.interface.format('json')
  };

  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n💾 Deployment info saved to:', `deployments/${network.name}.json`);
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update frontend with contract address');
  console.log('2. Verify contract on block explorer');
  console.log('3. Test contract functions');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
