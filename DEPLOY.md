# 🚀 FairLance Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **✅ Prerequisites**
- [ ] Node.js 18+ installed
- [ ] Git repository access
- [ ] Vercel account created
- [ ] MetaMask wallet with Sepolia ETH
- [ ] Infura account (for RPC endpoints)

### **✅ Environment Setup**
- [ ] All dependencies installed (`npm install`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors
- [ ] Smart contracts compile (`npx hardhat compile`)

---

## 🎯 **OPTION 1: Quick Hackathon Deploy (Recommended)**

### **⚡ 5-Minute Deployment**

```bash
# 1. Clone and setup
git clone https://github.com/your-repo/fairlance-project
cd fairlance-project

# 2. Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && npm install
cd ..

# 3. Deploy to Vercel (includes frontend + backend)
npx vercel --prod

# 4. Deploy smart contracts
cd contracts
npx hardhat run scripts/deploy.js --network sepolia

# 5. Update contract address in Vercel environment variables
# (Copy the deployed contract address from step 4)
```

### **🔧 Vercel Environment Variables**
Set these in your Vercel dashboard:

```env
# Frontend Variables
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x... (from contract deployment)
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Backend Variables  
MONGODB_URI=mongodb+srv://... (optional - uses file storage by default)
JWT_SECRET=your-super-secure-secret-key-here
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

---

## 🏗️ **OPTION 2: Production Deployment**

### **Frontend (Vercel)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from frontend directory
cd frontend
vercel --prod

# 4. Set environment variables in Vercel dashboard
```

### **Backend (Railway - Recommended)**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy backend
cd backend
railway up

# 5. Set environment variables
railway variables set MONGODB_URI=mongodb+srv://...
railway variables set JWT_SECRET=your-secret
railway variables set PORT=5001
railway variables set NODE_ENV=production
```

### **Backend (Alternative: Render)**

```bash
# 1. Connect GitHub repo to Render
# 2. Create new Web Service
# 3. Set build command: cd backend && npm install
# 4. Set start command: cd backend && node server-working.js
# 5. Set environment variables in Render dashboard
```

### **Backend (Alternative: Heroku)**

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Create Heroku app
heroku create fairlance-backend

# 3. Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# 4. Deploy backend only
git subtree push --prefix backend heroku main
```

---

## 🔗 **Smart Contract Deployment**

### **Sepolia Testnet (Recommended for Demo)**

```bash
# 1. Setup environment
cd contracts
cp .env.example .env

# 2. Configure .env file
PRIVATE_KEY=0x... (your wallet private key)
INFURA_PROJECT_ID=... (from infura.io)
ETHERSCAN_API_KEY=... (from etherscan.io)

# 3. Compile contracts
npx hardhat compile

# 4. Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# 5. Verify contract (optional)
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### **Polygon Mumbai (Alternative)**

```bash
# Deploy to Mumbai testnet (cheaper gas)
npx hardhat run scripts/deploy.js --network mumbai
```

### **Mainnet (Production Only)**

```bash
# Ethereum mainnet (expensive)
npx hardhat run scripts/deploy.js --network mainnet

# Polygon mainnet (cheaper)
npx hardhat run scripts/deploy.js --network polygon
```

---

## 💾 **Database Options**

### **Option 1: File Storage (Default - No Setup)**
- ✅ Works immediately
- ✅ Perfect for hackathon demo
- ✅ Persistent across deployments
- ⚠️ Limited scalability

### **Option 2: MongoDB Atlas (Production)**

```bash
# 1. Create cluster at mongodb.com
# 2. Get connection string
# 3. Set MONGODB_URI environment variable
# 4. Backend will automatically use MongoDB if URI is provided
```

### **Option 3: Railway PostgreSQL**

```bash
# 1. Add PostgreSQL service in Railway
# 2. Update backend to use PostgreSQL (requires code changes)
# 3. Run database migrations
```

### **Option 4: Supabase**

```bash
# 1. Create project at supabase.com
# 2. Get PostgreSQL connection string
# 3. Update backend configuration
```

---

## 🧪 **Testing Deployment**

### **Health Checks**

```bash
# Test frontend
curl https://your-app.vercel.app

# Test backend API
curl https://your-app.vercel.app/api/health

# Test database
curl https://your-app.vercel.app/api/users

# Test smart contract
# Check on Etherscan: https://sepolia.etherscan.io/address/YOUR_CONTRACT
```

### **End-to-End Test**

```bash
# 1. Register new user
curl -X POST https://your-app.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"userType":"freelancer","firstName":"Test","lastName":"User","email":"test@demo.com","walletAddress":"0x123..."}'

# 2. Submit proposal (with authentication)
curl -X POST https://your-app.vercel.app/api/proposals \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: 0x123..." \
  -d '{"projectId":1,"proposedBudget":1000,"proposedTimeline":"2 weeks","coverLetter":"Test"}'

# 3. Check proposal was created
curl https://your-app.vercel.app/api/proposals
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**Frontend Build Fails:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Backend Won't Start:**
```bash
# Check environment variables
echo $NODE_ENV
echo $PORT

# Check logs
vercel logs
# or
railway logs
```

**Smart Contract Deployment Fails:**
```bash
# Check network configuration
npx hardhat network

# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia

# Verify private key and Infura settings
```

**Database Connection Issues:**
```bash
# Test MongoDB connection
node -e "console.log(process.env.MONGODB_URI)"

# Check file permissions (for file storage)
ls -la backend/fairlance_database.json
```

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- Enable in Vercel dashboard
- Monitor page views and performance
- Track user engagement

### **Backend Monitoring**
```bash
# Railway monitoring (built-in)
railway status

# Custom health endpoint
curl https://your-app.vercel.app/api/health
```

### **Smart Contract Monitoring**
- Use Etherscan for transaction tracking
- Set up Tenderly for advanced monitoring
- Monitor gas usage and optimization

---

## 🎯 **Post-Deployment Checklist**

### **✅ Verification Steps**
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] Wallet connection functional
- [ ] Project browsing works
- [ ] Proposal submission requires authentication
- [ ] MasChain branding visible
- [ ] Smart contracts deployed and verified
- [ ] Database persisting data
- [ ] All API endpoints responding

### **✅ Demo Preparation**
- [ ] Test complete user flow
- [ ] Prepare demo script
- [ ] Check mobile responsiveness
- [ ] Verify all features work
- [ ] Backup deployment ready

---

## 🏆 **Success Metrics**

### **Performance Targets**
- ✅ Page load time < 3 seconds
- ✅ API response time < 500ms
- ✅ 99.9% uptime during demo
- ✅ Zero JavaScript errors
- ✅ Mobile responsive design

### **Demo Readiness**
- ✅ All features functional
- ✅ Realistic data populated
- ✅ Professional UI/UX
- ✅ MasChain integration visible
- ✅ Authentication working
- ✅ Smart contracts deployed

---

## 🚀 **Quick Deploy Script**

Save this as `deploy.sh`:

```bash
#!/bin/bash
echo "🚀 FairLance Quick Deploy"
echo "========================"

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

# Deploy contracts
echo "🔗 Deploying smart contracts..."
cd contracts
npx hardhat run scripts/deploy.js --network sepolia

echo "✅ Deployment complete!"
echo "🔗 Frontend: https://your-app.vercel.app"
echo "📊 Update contract address in Vercel environment variables"
```

**FairLance is ready for production deployment! 🎯**
