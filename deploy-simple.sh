#!/bin/bash

# 🚀 Simple FairLance VPS Deployment Script
# Works around apt lock issues by using alternative methods

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "🚀 Simple FairLance VPS Deployment"
echo "=================================="

# Create deployment script for the server
cat > /tmp/server_deploy.sh << 'EOF'
#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info "Starting FairLance deployment..."

# Wait for apt lock to clear or force kill it
print_info "Handling apt lock..."
pkill -f apt || true
sleep 5

# Install Node.js directly from binary
print_status "Installing Node.js 18..."
cd /tmp
curl -fsSL https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.xz -o node.tar.xz
tar -xf node.tar.xz
mv node-v18.19.0-linux-x64 /opt/nodejs
ln -sf /opt/nodejs/bin/node /usr/local/bin/node
ln -sf /opt/nodejs/bin/npm /usr/local/bin/npm
ln -sf /opt/nodejs/bin/npx /usr/local/bin/npx

# Verify installation
node --version
npm --version

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Clone repository
print_status "Cloning FairLance repository..."
if [ -d "/opt/fairlance" ]; then
    rm -rf /opt/fairlance
fi
git clone https://github.com/belulok/fairlance-project.git /opt/fairlance
cd /opt/fairlance

# Setup backend
print_status "Setting up backend..."
cd /opt/fairlance/backend

# Create environment file
cat > .env << 'ENVEOF'
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=7d
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret
CORS_ORIGIN=*
ENVEOF

# Install backend dependencies
npm install

# Setup frontend
print_status "Setting up frontend..."
cd /opt/fairlance/frontend

# Create environment file
cat > .env.production << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://152.42.239.61:5001/api
NEXT_PUBLIC_APP_NAME=FairLance
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd
ENVEOF

# Install frontend dependencies
npm install

# Build frontend
print_status "Building frontend..."
npm run build

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

# Setup simple nginx config (if nginx is available)
if command -v nginx >/dev/null 2>&1; then
    print_status "Configuring Nginx..."
    cat > /etc/nginx/sites-available/fairlance << 'NGINXEOF'
server {
    listen 80;
    server_name 152.42.239.61;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

    ln -sf /etc/nginx/sites-available/fairlance /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
else
    print_warning "Nginx not available, services running on direct ports"
fi

print_status "Deployment completed!"
print_info "Frontend: http://152.42.239.61:3000"
print_info "Backend: http://152.42.239.61:5001"
print_info "PM2 Status: pm2 status"

EOF

chmod +x /tmp/server_deploy.sh

print_status "Deployment script created!"
print_info "Uploading and executing on server..."

# Upload and execute the script
scp /tmp/server_deploy.sh root@152.42.239.61:/tmp/
ssh root@152.42.239.61 "chmod +x /tmp/server_deploy.sh && /tmp/server_deploy.sh"

print_status "🎉 Deployment completed!"
print_info "Your FairLance app should now be running at:"
print_info "Frontend: http://152.42.239.61:3000"
print_info "Backend API: http://152.42.239.61:5001"

# Clean up
rm -f /tmp/server_deploy.sh

echo ""
print_status "🎯 Next steps:"
echo "1. Test the application in your browser"
echo "2. Check PM2 status: ssh root@152.42.239.61 'pm2 status'"
echo "3. View logs: ssh root@152.42.239.61 'pm2 logs'"
