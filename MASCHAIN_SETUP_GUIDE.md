# 🚀 MasChain Integration Setup Guide

## Overview
This guide will help you connect MetaMask to MasChain testnet and deploy the FairLance escrow contract using your real MasChain credentials.

## 📋 Prerequisites
- ✅ MetaMask browser extension installed
- ✅ MasChain API credentials (you have these!)
  - Client Key: `4f7f28e4ef773f559a0adb70fad032d8a7e8ba5ae56e91a8f5809b4db6aa7958`
  - Client Secret: `sk_9fc7cd7b697b0ca3edcaaa28613eaa005f97ee975a0ad86025f10a3bd6b42955`
- ✅ Active MasChain services:
  - Non-fungible Token Service ✅
  - Audit Trail Service ✅
  - Wallet Service ✅
  - Token Service ✅
  - Custom Smart Contract ✅

## 🔧 Step 1: Configure MetaMask for MasChain

### Manual Network Addition
1. Open MetaMask
2. Click on the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" or "Custom RPC"
4. Enter the following details:

```
Network Name: MasChain Testnet
New RPC URL: https://rpc-testnet.maschain.com
Chain ID: 698
Currency Symbol: MAS
Block Explorer URL: https://explorer-testnet.maschain.com
```

### Automatic Network Addition (via FairLance App)
1. Go to http://localhost:3000/maschain
2. Click "Connect MetaMask"
3. The app will automatically prompt to add MasChain network
4. Approve the network addition in MetaMask

## 💰 Step 2: Get Test MAS Tokens

You'll need MAS tokens to pay for gas fees. You can:

1. **Use MasChain Faucet** (if available):
   - Visit MasChain testnet faucet
   - Enter your wallet address
   - Request test tokens

2. **Contact MasChain Support**:
   - Request testnet tokens for development
   - Provide your wallet address

## 🏗️ Step 3: Deploy FairLance Escrow Contract

### Option A: Using the Deployment Script

1. **Prepare your wallet address**:
   ```bash
   # Copy your MetaMask wallet address (starts with 0x...)
   ```

2. **Run the deployment script**:
   ```bash
   cd backend
   node scripts/deploy-maschain-contract.js YOUR_WALLET_ADDRESS
   ```

   Example:
   ```bash
   node scripts/deploy-maschain-contract.js 0x1234567890123456789012345678901234567890
   ```

3. **Monitor deployment**:
   - The script will show real-time progress
   - Deployment info will be saved to `backend/deployment-info.json`
   - Check the MasChain explorer for transaction details

### Option B: Using MasChain Portal

1. **Login to MasChain Portal**:
   - Visit https://portal-testnet.maschain.com
   - Login with your credentials

2. **Create Smart Contract Project**:
   - Go to Custom Smart Contract section
   - Create new project: "FairLance Escrow"
   - Upload the contract source code from `contracts/FairLanceEscrow.sol`

3. **Deploy Contract**:
   - Set compiler version to 0.8.19
   - Enable optimization
   - Deploy with your wallet address as owner

## 🔗 Step 4: Connect to FairLance App

1. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

2. **Access the app**:
   - Open http://localhost:3000/maschain
   - Connect your MetaMask wallet
   - Switch to MasChain network when prompted

3. **Register with MasChain**:
   - Fill in your profile information
   - Click "Register with MasChain"
   - This creates a self-custodian wallet entry in MasChain

## 🧪 Step 5: Test the Integration

### Test Wallet Connection
1. Connect MetaMask to the app
2. Verify network shows "MasChain"
3. Check that your MAS balance is displayed
4. Confirm registration with MasChain works

### Test Contract Interaction (after deployment)
1. Create a test project
2. Fund the escrow
3. Submit work with IPFS/GitHub hashes
4. Test approval and payment release

## 🔍 Verification & Monitoring

### Check Deployment Status
- **MasChain Explorer**: https://explorer-testnet.maschain.com
- **Search by**: Transaction hash or contract address
- **Verify**: Contract is deployed and verified

### Monitor API Usage
- **Portal Dashboard**: https://portal-testnet.maschain.com
- **Check**: API call usage and limits
- **Monitor**: Transaction success rates

## 🚨 Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**:
   - Ensure MetaMask is unlocked
   - Check if MasChain network is added correctly
   - Try refreshing the page

2. **Insufficient Gas**:
   - Get more MAS tokens from faucet
   - Check gas price settings in MetaMask

3. **Contract Deployment Failed**:
   - Verify wallet has sufficient MAS balance
   - Check MasChain API limits
   - Review contract code for compilation errors

4. **API Authentication Failed**:
   - Verify credentials in `.env` file
   - Check if services are active in MasChain portal
   - Ensure API limits haven't been exceeded

### Debug Commands

```bash
# Test MasChain API connection
curl -X GET "https://service-testnet.maschain.com/api/wallet/get-smart-contracts" \
  -H "client_id: YOUR_CLIENT_ID" \
  -H "client_secret: YOUR_CLIENT_SECRET"

# Check backend logs
cd backend && npm start

# Check contract compilation
cd contracts && npx hardhat compile
```

## 📚 Next Steps

After successful setup:

1. **Implement Token System**:
   - Create FairLance utility token
   - Implement staking mechanisms
   - Add reputation scoring

2. **Add KYC Integration**:
   - Use MasChain e-KYC service
   - Implement identity verification
   - Add compliance features

3. **Enhance Escrow Features**:
   - Multi-milestone projects
   - Dispute resolution system
   - Automated payments

4. **Production Deployment**:
   - Switch to MasChain mainnet
   - Update RPC endpoints
   - Configure production credentials

## 🔗 Useful Links

- **MasChain Documentation**: https://docs.maschain.com/
- **MasChain Testnet Explorer**: https://explorer-testnet.maschain.com
- **MasChain Portal**: https://portal-testnet.maschain.com
- **MetaMask Documentation**: https://docs.metamask.io/

## 💡 Tips

1. **Keep credentials secure**: Never commit API keys to version control
2. **Monitor gas usage**: MasChain has different gas economics than Ethereum
3. **Test thoroughly**: Use testnet extensively before mainnet deployment
4. **Stay updated**: Follow MasChain updates and API changes

---

**Ready to deploy?** Run the deployment script with your wallet address and watch the magic happen! 🎉
