# 🔗 FairLance Web3 Integration Guide

## 🎯 **Current Status**

### ✅ **What's Working**
- **Frontend**: React 18 + Next.js 14 + RainbowKit + Wagmi
- **Wallet Connection**: MetaMask integration ready
- **Multi-Chain**: Mainnet, Sepolia, Polygon, Arbitrum, Base, Optimism
- **Backend**: MasChain API service configured
- **Smart Contracts**: Escrow contract written and ready to deploy

### ⚠️ **What Needs Setup**
- MasChain API credentials
- Smart contract deployment
- Contract address configuration
- Testnet ETH for deployment

---

## 🚀 **Quick Setup (10 minutes)**

### **Step 1: Install MetaMask**
1. Install MetaMask browser extension
2. Create or import wallet
3. **Important**: Use a test wallet, not your main wallet!

### **Step 2: Get Test ETH**
For Sepolia testnet:
- Visit: https://sepoliafaucet.com/
- Enter your wallet address
- Get free test ETH

### **Step 3: Deploy Smart Contracts**
```bash
# Install dependencies
cd contracts
npm install

# Copy environment file
cp .env.example .env

# Add your test wallet private key to .env
echo "PRIVATE_KEY=your-metamask-private-key" >> .env

# Deploy to local network (for testing)
npx hardhat node  # Terminal 1
npm run deploy:local  # Terminal 2

# OR deploy to Sepolia testnet
npm run deploy:sepolia
```

### **Step 4: Update Frontend**
After deployment, copy the contract address and update:

```bash
# Add to frontend/.env.local
echo "NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...your-contract-address" >> frontend/.env.local
```

### **Step 5: Test Integration**
1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select MetaMask
4. Approve connection
5. You should see your wallet address in the navigation!

---

## 🔧 **Detailed Configuration**

### **MasChain API Setup**
1. **Register**: https://docs.maschain.com/
2. **Get credentials**: API Key + Secret
3. **Update backend/.env**:
```env
MASCHAIN_API_KEY=your-actual-api-key
MASCHAIN_API_SECRET=your-actual-api-secret
```

### **Network Configuration**

#### **Local Development**
```env
# Hardhat local network
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337
```

#### **Sepolia Testnet**
```env
# Sepolia testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
CHAIN_ID=11155111
```

#### **Polygon Mumbai**
```env
# Polygon Mumbai testnet
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
CHAIN_ID=80001
```

### **Add Networks to MetaMask**

#### **Hardhat Local**
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

#### **Sepolia Testnet**
- Network Name: `Sepolia`
- RPC URL: `https://sepolia.infura.io/v3/YOUR-PROJECT-ID`
- Chain ID: `11155111`
- Currency Symbol: `ETH`
- Block Explorer: `https://sepolia.etherscan.io`

---

## 🧪 **Testing Smart Contracts**

### **Available Functions**
1. **createProject**: Create escrow with milestones
2. **startProject**: Freelancer accepts project
3. **submitMilestone**: Submit work with IPFS/GitHub hash
4. **approveMilestone**: Client approves and releases payment
5. **raiseDispute**: Initiate dispute resolution

### **Test Scenario**
```javascript
// 1. Client creates project
await createProject(
  freelancerAddress,
  "Build React App",
  "Create a modern React application",
  deadline,
  ["Design", "Development", "Testing"],
  ["0.1", "0.3", "0.1"], // ETH amounts
  [date1, date2, date3]
);

// 2. Freelancer starts work
await startProject(projectId);

// 3. Submit milestone with proof
await submitMilestone(
  projectId, 
  0, 
  "QmYourIPFSHash" // or GitHub commit hash
);

// 4. Client approves and payment is instant!
await approveMilestone(projectId, 0);
```

---

## 🎯 **Key Features Enabled**

### **Zero-Fee Escrow** 💰
- Traditional platforms: 5-20% fees
- FairLance: 0% fees (competitive advantage!)
- Instant payments upon approval

### **Verifiable Work Delivery** 🔍
- Submit IPFS hashes for files
- Submit GitHub commit hashes for code
- Cryptographic proof of work completion
- Objective dispute resolution

### **Portable Reputation** 🏆
- Trust NFTs minted for completed projects
- Reputation follows you across platforms
- Bankable certificates for loan applications

### **Global Accessibility** 🌍
- No geographic restrictions
- Work with anyone, anywhere
- Instant cross-border payments

---

## 🚨 **Security Notes**

### **Development Safety**
- ✅ Use test wallets only
- ✅ Never commit private keys to git
- ✅ Use environment variables
- ✅ Test on testnets first

### **Production Checklist**
- [ ] Smart contract audit
- [ ] Multi-signature wallet setup
- [ ] Emergency pause functionality
- [ ] Proper access controls
- [ ] Gas optimization

---

## 🔗 **Useful Links**

- **MetaMask**: https://metamask.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **MasChain Docs**: https://docs.maschain.com/
- **Hardhat Docs**: https://hardhat.org/docs
- **RainbowKit**: https://rainbowkit.com/
- **Wagmi**: https://wagmi.sh/

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **"WagmiProvider not found"**
- Ensure providers are properly wrapped
- Check dynamic import configuration
- Restart development server

#### **"Transaction failed"**
- Check you have enough test ETH
- Verify contract address is correct
- Check network connection

#### **"Contract not deployed"**
- Run deployment script
- Update contract address in frontend
- Verify network configuration

### **Getting Help**
1. Check browser console for errors
2. Verify MetaMask is connected
3. Ensure correct network is selected
4. Check contract deployment status

---

## 🎉 **Success Metrics**

When everything is working, you should see:
- ✅ Wallet connects successfully
- ✅ Contract address displays in frontend
- ✅ Can create test projects
- ✅ Milestone payments work
- ✅ Zero transaction fees (except gas)

**You're now running a fully decentralized freelance platform!** 🚀
