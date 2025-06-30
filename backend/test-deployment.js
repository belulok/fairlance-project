const MasChainContractDeployer = require('./scripts/deploy-maschain-contract');

async function testDeployment() {
  console.log('🧪 Testing MasChain Contract Deployment\n');
  
  // Test wallet address (you should replace this with your actual wallet address)
  const testWalletAddress = '0x1234567890123456789012345678901234567890';
  
  console.log('⚠️  IMPORTANT: This is a test deployment script.');
  console.log('📝 Please replace the test wallet address with your actual MetaMask wallet address.');
  console.log(`🔗 Current test address: ${testWalletAddress}\n`);
  
  console.log('📋 To deploy with your actual wallet:');
  console.log('1. Connect MetaMask to http://localhost:3000/maschain');
  console.log('2. Copy your wallet address from MetaMask');
  console.log('3. Run: node scripts/deploy-maschain-contract.js YOUR_WALLET_ADDRESS\n');
  
  console.log('🔍 Testing API connection first...\n');
  
  try {
    const deployer = new MasChainContractDeployer();
    
    // Test API connection by listing existing projects
    const axios = require('axios');
    const response = await axios.get('https://service-testnet.maschain.com/api/contract/projects', {
      headers: {
        'client_id': process.env.MASCHAIN_API_KEY,
        'client_secret': process.env.MASCHAIN_API_SECRET,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ MasChain API connection successful!');
    console.log(`📊 Found ${response.data.result?.length || 0} existing projects\n`);
    
    console.log('🚀 Ready to deploy! Use one of these commands:');
    console.log('');
    console.log('📱 Option 1 - Deploy with MetaMask address:');
    console.log('   1. Get your MetaMask address from the web app');
    console.log('   2. Run: node scripts/deploy-maschain-contract.js YOUR_METAMASK_ADDRESS');
    console.log('');
    console.log('🏢 Option 2 - Deploy with organization wallet:');
    console.log('   1. Check your MasChain portal for organization wallet addresses');
    console.log('   2. Run: node scripts/deploy-maschain-contract.js YOUR_ORG_WALLET_ADDRESS');
    console.log('');
    console.log('📖 For more details, see: MASCHAIN_SETUP_GUIDE.md');
    
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env file has the correct MasChain credentials');
    console.log('2. Verify your MasChain services are active in the portal');
    console.log('3. Check your internet connection');
  }
}

// Run the test
if (require.main === module) {
  testDeployment().catch(console.error);
}

module.exports = testDeployment;
