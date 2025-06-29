#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_info "Setting up FairLance on VPS..."

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 for process management
print_status "Installing PM2..."
npm install -g pm2

# Install nginx for reverse proxy
print_status "Installing Nginx..."
apt install -y nginx

# Clone or update repository
if [ -d "/opt/fairlance" ]; then
    print_status "Updating existing repository..."
    cd /opt/fairlance
    git pull origin main
else
    print_status "Cloning repository..."
    git clone https://github.com/belulok/fairlance-project.git /opt/fairlance
    cd /opt/fairlance
fi

# Set up backend
print_status "Setting up backend..."
cd /opt/fairlance/backend

# Create production environment file
cat > .env << 'ENVEOF'
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=7d

# MasChain Configuration
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret

# CORS
CORS_ORIGIN=*
ENVEOF

# Install backend dependencies
npm install

# Set up frontend
print_status "Setting up frontend..."
cd /opt/fairlance/frontend

# Create production environment file
cat > .env.production << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://152.42.239.61:5001/api
NEXT_PUBLIC_APP_NAME=FairLance
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd
ENVEOF

# Install frontend dependencies and build
npm install
npm run build

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/fairlance << 'NGINXEOF'
server {
    listen 80;
    server_name 152.42.239.61;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/fairlance /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Start services with PM2
print_status "Starting services..."
cd /opt/fairlance

# Start backend
pm2 delete fairlance-backend 2>/dev/null || true
pm2 start backend/server-simple.js --name fairlance-backend

# Start frontend
pm2 delete fairlance-frontend 2>/dev/null || true
cd frontend
pm2 start npm --name fairlance-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Restart nginx
systemctl restart nginx
systemctl enable nginx

print_status "Deployment completed!"
print_info "Frontend: http://152.42.239.61"
print_info "Backend API: http://152.42.239.61/api"
print_info "PM2 Status: pm2 status"

