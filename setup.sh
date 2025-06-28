#!/bin/bash

# 🚀 FairLance Quick Setup Script
# This script sets up the entire FairLance development environment

echo "🚀 Setting up FairLance - Smart Contract Escrow for the Gig Economy"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found"
    exit 1
fi

print_info "Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    print_info "Creating backend .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fairlance

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# MasChain Configuration
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000
EOF
    print_warning "Created backend/.env - Please update MasChain API credentials"
fi

print_status "Backend setup complete"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found"
    exit 1
fi

print_info "Installing frontend dependencies..."
npm install --legacy-peer-deps

if [ ! -f ".env.local" ]; then
    print_info "Creating frontend .env.local file..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_APP_NAME=FairLance
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...your-deployed-contract
EOF
    print_warning "Created frontend/.env.local - Update contract address after deployment"
fi

print_status "Frontend setup complete"

# Setup Contracts
echo ""
echo "📄 Setting up Smart Contracts..."
cd ../contracts

if [ ! -f "package.json" ]; then
    print_info "Installing contract dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    print_info "Creating contracts .env file..."
    cat > .env << EOF
# Private key for deployment (DO NOT COMMIT TO GIT)
PRIVATE_KEY=your-metamask-private-key-for-testing

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
MASCHAIN_RPC_URL=https://rpc-testnet.maschain.com

# API Keys for verification
ETHERSCAN_API_KEY=your-etherscan-api-key
POLYGONSCAN_API_KEY=your-polygonscan-api-key

# Gas reporting
REPORT_GAS=true
EOF
    print_warning "Created contracts/.env - Add your MetaMask private key for testing"
fi

print_status "Smart contracts setup complete"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🔧 Start Backend:"
echo "   cd backend && PORT=5001 node server-simple.js"
echo ""
echo "2. 🎨 Start Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. 🌐 Open Browser:"
echo "   http://localhost:3000"
echo ""
echo "4. 🔗 Connect MetaMask:"
echo "   Click 'Connect Wallet' and approve connection"
echo ""
echo "5. 📄 Deploy Contracts (Optional):"
echo "   cd contracts && npx hardhat node"
echo "   cd contracts && npm run deploy:local"
echo ""
echo "🔗 Useful Links:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:5001"
echo "   • Documentation: README.md"
echo "   • Web3 Setup: WEB3_SETUP.md"
echo ""
print_status "FairLance is ready to revolutionize freelancing! 🚀"
