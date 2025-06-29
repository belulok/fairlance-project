#!/bin/bash

# FairLance Server Update Script
echo "🚀 Updating FairLance on server..."

# Navigate to the project directory
cd /opt/fairlance

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Navigate to frontend directory
cd frontend

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install

# Stop the current frontend process
echo "🛑 Stopping current frontend process..."
pm2 stop fairlance-frontend

# Start the frontend process
echo "▶️ Starting frontend process..."
pm2 start npm --name "fairlance-frontend" -- run dev

# Show PM2 status
echo "📊 Current PM2 status:"
pm2 list

echo "✅ Update complete! FairLance should now be running with the latest changes."
echo "🌐 Access your application at: http://152.42.239.61:3000"
