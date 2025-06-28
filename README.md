# 🚀 FairLance - Smart Contract Escrow for the Gig Economy

**The Future of Freelancing is Here!** 

FairLance revolutionizes the freelance industry with blockchain-powered escrow, zero fees, instant payments, and verifiable work delivery. Built on MasChain with cutting-edge Web3 features that traditional platforms like Upwork and Fiverr can't match.

## 🎯 **The Problem We Solve**

Traditional freelance platforms are broken:
- **High fees** (5-20% platform cuts)
- **Slow payments** (7-14 day processing)
- **Centralized control** (platform lock-in)
- **Trust issues** (no verifiable work history)
- **Geographic restrictions** (payment limitations)

## 💡 **Our Revolutionary Solution**

### **Core Features:**
1. **🔒 Smart Contract Escrow** - Automated, trustless payments
2. **🏆 Trust NFTs** - Portable, bankable reputation
3. **🔍 Proof-of-Work Verification** - GitHub/IPFS hash verification
4. **🆔 KYC + DID Integration** - MasChain identity verification
5. **🎮 Skill Token Economy** - Gamified expertise tokens

### **5 Game-Changing Differentiators:**

#### 1. **🧠 Proof-of-Work on Chain (Zero-Trust Verification)**
- Submit GitHub commit hashes, IPFS URIs as immutable proof
- **"Verifiable work = verifiable payment"**
- On-chain portfolio that can't be faked
- Objective dispute resolution

#### 2. **🛂 Freelancer KYC + DID Integration**
- MasChain Verifiable Credentials integration
- Fraud-proof profiles without central authorities
- Legitimate freelancers stand out from bots

#### 3. **🧮 Trust-to-Credit Bridge (Banking-Ready Reputation)**
- **"Fiverr + On-chain Experian"**
- Trust NFTs → loan eligibility simulation
- Real-world financial utility for developing countries
- No credit score? No problem - prove it with work!

#### 4. **🎮 Skill-Based Token Ecosystem**
- Each completed job mints skill tokens (React Level 2, Solidity Expert)
- Gamified expertise with verifiable capability
- Employers filter/hire based on wallet-owned skills
- Resume that's verifiable AND composable

#### 5. **🧠 Community DAO Formation for Complex Projects**
- Multiple freelancers form micro-DAOs with multi-sig wallets
- Pool trust, share payment, distribute rewards
- Real-world usage for agencies and open-source grants

## 🏗️ **Architecture**

### **Frontend (Next.js + TypeScript)**
- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Web3**: wagmi + viem for wallet integration
- **State**: React hooks + local storage

### **Backend (Node.js + Express)**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **API**: RESTful endpoints with proper error handling
- **Security**: Helmet, CORS, rate limiting

### **Blockchain Integration (MasChain)**
- **Wallet Management**: User wallet creation and management
- **e-KYC**: Identity verification with OCR + facial recognition
- **Smart Contracts**: Custom escrow contracts
- **Certificates**: Trust NFT issuance and verification
- **Tokens**: Skill token creation and distribution
- **Audit Trail**: Immutable work verification records

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- MongoDB (local or cloud)
- **MetaMask wallet** installed in browser
- MasChain API credentials (optional for full features)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/belulok/fairlance-project.git
cd fairlance-project
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your MasChain API credentials in .env
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Configure API URL in .env.local
npm run dev
```

4. **Setup Smart Contracts (Optional)**
```bash
cd ../contracts
npm install
cp .env.example .env
# Add your MetaMask private key for testing
npx hardhat node  # Start local blockchain
npm run deploy:local  # Deploy contracts
```

5. **Access the Application**
- Frontend: http://localhost:3000 ✅ **WORKING**
- Backend API: http://localhost:5001 ✅ **WORKING**
- Local Blockchain: http://127.0.0.1:8545 (if running)

### **Environment Variables**

**Backend (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/fairlance
JWT_SECRET=your-super-secret-jwt-key
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret
CORS_ORIGIN=http://localhost:3001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_APP_NAME=FairLance
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...your-deployed-contract
```

**Contracts (.env):**
```env
PRIVATE_KEY=your-metamask-private-key-for-testing
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
ETHERSCAN_API_KEY=your-etherscan-api-key
```

## � **Project Structure**

```
fairlance-project/
├── 📁 frontend/          # Next.js 14 + React 18 + TypeScript
│   ├── app/             # App router pages and components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (Web3 integration)
│   └── lib/             # Utility functions and API calls
├── 📁 backend/           # Express.js + MongoDB + MasChain
│   ├── src/             # Source code
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Database models
│   │   ├── services/    # MasChain integration
│   │   └── middleware/  # Authentication & validation
│   └── server-simple.js # Simplified server for demo
├── 📁 contracts/        # Smart contracts + Hardhat
│   ├── FairLanceEscrow.sol  # Main escrow contract
│   ├── deploy.js        # Deployment scripts
│   └── hardhat.config.js    # Hardhat configuration
├── 📄 README.md         # This file
├── 📄 WEB3_SETUP.md     # Web3 integration guide
└── 📄 DEPLOYMENT_GUIDE.md   # Complete setup instructions
```

## �🔗 **Web3 Integration Status**

### ✅ **Currently Working**
- **Wallet Connection**: MetaMask integration with RainbowKit
- **Multi-Chain Support**: Mainnet, Sepolia, Polygon, Arbitrum, Base, Optimism
- **Frontend Integration**: Connect wallet button, account display, chain switching
- **MasChain Backend**: API service ready for wallet creation, KYC, smart contracts

### 🚧 **Next Steps for Full Web3**
1. **Get MasChain API credentials** from https://docs.maschain.com/
2. **Deploy smart contracts** to testnet:
   ```bash
   cd contracts
   npm run deploy:sepolia  # or deploy:local for testing
   ```
3. **Update contract address** in frontend/.env.local
4. **Test escrow functionality** with MetaMask

### 🎯 **Smart Contract Features**
- **Zero-fee escrow**: No platform fees (vs 5-20% traditional)
- **Milestone payments**: Automated fund release
- **Proof-of-work**: IPFS/GitHub hash verification
- **Dispute resolution**: On-chain arbitration
- **Trust NFTs**: Portable reputation certificates

## 🎨 **Key Features Showcase**

### **1. Hero Banner with Search**
- Beautiful animated hero section
- Integrated project search
- Real-time statistics display
- Floating feature cards

### **2. Smart Contract Escrow**
- Automated fund holding
- Milestone-based releases
- Dispute resolution
- Zero platform fees

### **3. KYC Verification Dashboard**
- MasChain e-KYC integration
- Real-time status updates
- Trust score calculation
- Verification benefits display

### **4. Proof-of-Work Submission**
- GitHub commit verification
- IPFS hash validation
- File URL verification
- Blockchain hash generation

### **5. Skill Token Economy**
- Token earning system
- Level progression
- Leaderboards
- Portfolio integration

### **6. Trust NFT System**
- Automated NFT issuance
- Reputation certificates
- Verification system
- Portfolio display

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Projects**
- `GET /api/projects` - List projects with filters
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/apply` - Apply to project

### **Escrow**
- `POST /api/escrow/create` - Create escrow contract
- `POST /api/escrow/:projectId/fund` - Fund escrow
- `POST /api/escrow/:projectId/submit-milestone` - Submit work
- `POST /api/escrow/:projectId/approve-milestone` - Approve & release

### **KYC**
- `POST /api/kyc/initiate` - Start KYC process
- `GET /api/kyc/status` - Check KYC status

### **Certificates & Tokens**
- `GET /api/certificates/my-nfts` - Get user's Trust NFTs
- `GET /api/tokens/my-skills` - Get skill tokens
- `GET /api/tokens/skill-leaderboard/:skill` - Skill leaderboards

## 🌟 **What Makes This First-Place Material**

### **🔥 Problem**
The freelance economy is broken: high fees, slow pay, centralized control, and platform lock-in.

### **🚀 Solution**
FairLance replaces Upwork/Fiverr with:
- Smart contract escrow = instant, zero-fee payments
- NFT-based portable trust = bankable freelance history
- Verifiable work = objective delivery proofs
- Optional DAO-based dispute resolution
- Gamified skill economy and DID reputation system

### **🧱 Infrastructure Impact**
We've built a **decentralized trust and work coordination protocol** — not just a gig platform clone. It's an entire upgrade to the future of labor infrastructure.

### **🏁 Global Impact Vision**
*"Imagine a Nigerian freelancer with no bank account. After 50 jobs on FairLance, their Trust NFT gets them pre-qualified for a microloan from a regional fintech partner."*

**This isn't just tech — it's economic inclusion, scale, and SDG9 in action.**

## 🛠️ **Technology Stack**

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT
- **Blockchain**: MasChain (Wallet, KYC, Smart Contracts, NFTs, Tokens)
- **Web3**: wagmi, viem, wallet integration
- **UI**: shadcn/ui components, responsive design
- **DevOps**: Docker-ready, environment configuration

## 📈 **Future Roadmap**

- [ ] Mobile app development
- [ ] Advanced DAO governance features
- [ ] Integration with traditional banking APIs
- [ ] Multi-chain support
- [ ] AI-powered project matching
- [ ] Reputation-based lending protocols

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the future of work**

*FairLance - Where talent meets opportunity, powered by blockchain.*
