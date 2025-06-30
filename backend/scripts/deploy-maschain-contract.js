const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Deploy FairLance Escrow Contract to MasChain using Custom Smart Contract API
 */
class MasChainContractDeployer {
  constructor() {
    this.baseURL = process.env.MASCHAIN_API_URL || 'https://service-testnet.maschain.com';
    this.apiKey = process.env.MASCHAIN_API_KEY;
    this.apiSecret = process.env.MASCHAIN_API_SECRET;
    
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('MasChain API credentials not found in environment variables');
    }
  }

  generateAuthHeaders() {
    return {
      'client_id': this.apiKey,
      'client_secret': this.apiSecret,
      'Content-Type': 'application/json'
    };
  }

  async createSmartContractProject(projectData) {
    try {
      const endpoint = '/api/contract/projects';
      const headers = this.generateAuthHeaders();

      const response = await axios.post(`${this.baseURL}${endpoint}`, projectData, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('Error creating smart contract project:', error.response?.data || error.message);
      throw error;
    }
  }

  async createProjectVersion(projectSlug, formData) {
    try {
      const endpoint = `/api/contract/projects/${projectSlug}/versions`;
      const headers = {
        'client_id': this.apiKey,
        'client_secret': this.apiSecret,
        // Don't set Content-Type for FormData - let axios handle it
      };

      const response = await axios.post(`${this.baseURL}${endpoint}`, formData, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('Error creating project version:', error.response?.data || error.message);
      throw error;
    }
  }

  async deployContract(projectSlug, versionSlug, deployData) {
    try {
      const endpoint = `/api/contract/projects/${projectSlug}/versions/${versionSlug}/deploy`;
      const headers = this.generateAuthHeaders();

      const response = await axios.post(`${this.baseURL}${endpoint}`, deployData, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('Error deploying contract:', error.response?.data || error.message);
      throw error;
    }
  }

  async getProjectVersionDetails(projectSlug, versionSlug) {
    try {
      const endpoint = `/api/contract/projects/${projectSlug}/versions/${versionSlug}`;
      const headers = this.generateAuthHeaders();

      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers
      });

      return response.data;
    } catch (error) {
      console.error('Error getting project version details:', error.response?.data || error.message);
      throw error;
    }
  }

  readContractSource() {
    const contractPath = path.join(__dirname, '../../contracts/SimpleFairLanceEscrow.sol');

    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }

    return fs.readFileSync(contractPath, 'utf8');
  }

  async deployFairLanceEscrow(ownerWalletAddress) {
    console.log('🚀 Starting FairLance Escrow Contract Deployment to MasChain...\n');

    try {
      // Step 1: Read contract source code
      console.log('📖 Reading contract source code...');
      const contractSource = this.readContractSource();
      console.log('✅ Contract source code loaded\n');

      // Step 2: Create Smart Contract Project
      console.log('📝 Creating smart contract project...');
      const projectData = {
        project_name: 'FairLance Escrow',
        description: 'Decentralized escrow system for freelance projects with proof-of-work verification'
      };

      const projectResult = await this.createSmartContractProject(projectData);
      console.log('✅ Project created:', projectResult);

      if (projectResult.message !== 'Success') {
        throw new Error('Failed to create project: ' + projectResult.message);
      }

      const projectSlug = projectResult.result.slug;
      console.log(`📋 Project Slug: ${projectSlug}\n`);

      // Step 3: Create Project Version with Contract Code
      console.log('📦 Creating project version with contract code...');

      // Create FormData for file upload
      const FormData = require('form-data');
      const formData = new FormData();

      // Write contract to temporary file
      const tempContractPath = path.join(__dirname, 'temp_SimpleFairLanceEscrow.sol');
      fs.writeFileSync(tempContractPath, contractSource);

      // Add form fields
      formData.append('version', 'v1.0.1');
      formData.append('compiler_settings[solidity][version]', '0.8.0');
      formData.append('compiler_settings[solidity][settings][optimizer][enabled]', '1');
      formData.append('compiler_settings[solidity][settings][optimizer][runs]', '200');
      formData.append('contract_files[]', fs.createReadStream(tempContractPath));

      const versionResult = await this.createProjectVersion(projectSlug, formData);
      console.log('✅ Project version created:', versionResult);

      // Clean up temp file
      fs.unlinkSync(tempContractPath);

      if (versionResult.message !== 'Success') {
        throw new Error('Failed to create project version: ' + versionResult.message);
      }

      const versionSlug = versionResult.result.slug;
      console.log(`📦 Version Slug: ${versionSlug}\n`);

      // Step 4: Wait for compilation to complete
      console.log('⏳ Waiting for contract compilation...');
      let compilationComplete = false;
      let attempts = 0;
      const maxAttempts = 20; // 2 minutes with 6-second intervals

      while (!compilationComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 6000)); // Wait 6 seconds
        attempts++;

        try {
          const versionDetails = await this.getProjectVersionDetails(projectSlug, versionSlug);
          console.log(`📊 Compilation check ${attempts}:`, versionDetails.result?.status || 'pending');

          if (versionDetails.result?.status === 'compiled') {
            compilationComplete = true;
            console.log('✅ Contract compiled successfully!\n');
          } else if (versionDetails.result?.status === 'compile_failed') {
            throw new Error('Contract compilation failed: ' + versionDetails.result.latest_error);
          }
        } catch (statusError) {
          console.log(`⚠️  Compilation check ${attempts} failed:`, statusError.message);
        }
      }

      if (!compilationComplete) {
        throw new Error('Compilation timeout - please check MasChain portal for status');
      }

      // Step 5: Get contract artifacts for deployment
      const versionDetails = await this.getProjectVersionDetails(projectSlug, versionSlug);
      const artifacts = versionDetails.result.artifacts;

      if (!artifacts || artifacts.length === 0) {
        throw new Error('No contract artifacts found after compilation');
      }

      // Find the main contract artifact
      const mainArtifact = artifacts.find(a => a.contract_name === 'SimpleFairLanceEscrow');
      if (!mainArtifact) {
        throw new Error('SimpleFairLanceEscrow contract artifact not found');
      }

      console.log(`🔧 Found contract artifact ID: ${mainArtifact.id}\n`);

      // Step 6: Deploy Contract
      console.log('🚀 Deploying contract to MasChain...');
      const deployData = {
        wallet_options: {
          type: 'organisation', // Using custodial wallet
          address: ownerWalletAddress
        },
        deployment_params: [
          {
            sc_artifact_id: mainArtifact.id,
            params: null, // No constructor parameters
            order: 1
          }
        ],
        callback_url: `${process.env.BACKEND_URL}/api/maschain/deployment-callback`
      };

      const deployResult = await this.deployContract(projectSlug, versionSlug, deployData);
      console.log('✅ Deployment initiated:', deployResult);

      if (deployResult.message !== 'Success') {
        throw new Error('Failed to deploy contract: ' + deployResult.message);
      }

      const deploymentId = deployResult.result.deployment_id;
      console.log(`🔗 Deployment ID: ${deploymentId}\n`);

      // Step 7: Monitor deployment status
      console.log('⏳ Monitoring deployment status...');
      console.log('📝 Note: This may take several minutes. Please check the MasChain portal for real-time updates.');
      console.log(`🌐 Portal: https://portal-testnet.maschain.com\n`);

      // Save deployment info
      const deploymentInfo = {
        contractName: 'SimpleFairLanceEscrow',
        deploymentId: deploymentId,
        projectSlug: projectSlug,
        versionSlug: versionSlug,
        artifactId: mainArtifact.id,
        deployedAt: new Date().toISOString(),
        network: 'MasChain Testnet',
        ownerAddress: ownerWalletAddress,
        status: 'pending'
      };

      fs.writeFileSync(
        path.join(__dirname, '../deployment-info.json'),
        JSON.stringify(deploymentInfo, null, 2)
      );

      console.log('💾 Deployment info saved to backend/deployment-info.json');
      console.log('🔔 You will receive a callback when deployment completes');

      return deploymentInfo;

    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      throw error;
    }
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node deploy-maschain-contract.js <owner_wallet_address>');
    console.log('Example: node deploy-maschain-contract.js 0x1234567890123456789012345678901234567890');
    process.exit(1);
  }

  const ownerWalletAddress = args[0];
  
  // Validate wallet address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(ownerWalletAddress)) {
    console.error('❌ Invalid wallet address format');
    process.exit(1);
  }

  try {
    const deployer = new MasChainContractDeployer();
    const result = await deployer.deployFairLanceEscrow(ownerWalletAddress);
    
    console.log('\n🎊 Deployment Summary:');
    console.log('='.repeat(50));
    console.log(`Contract: ${result.contractName}`);
    console.log(`Address: ${result.contractAddress}`);
    console.log(`Network: ${result.network}`);
    console.log(`Owner: ${result.ownerAddress}`);
    console.log(`Deployed: ${result.deployedAt}`);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n💥 Deployment failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = MasChainContractDeployer;

// Run if called directly
if (require.main === module) {
  main();
}
