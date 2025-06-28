#!/bin/bash

# 🚀 FairLance GCP Cloud Run Deployment Script

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

echo "🚀 Deploying FairLance to GCP Cloud Run"
echo "======================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project variables
PROJECT_ID=${1:-"fairlance-demo"}
REGION=${2:-"us-central1"}

print_info "Project ID: $PROJECT_ID"
print_info "Region: $REGION"

# Set the project
print_info "Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
print_info "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy backend
print_info "Building and deploying backend..."
cd backend

gcloud builds submit --tag gcr.io/$PROJECT_ID/fairlance-backend

gcloud run deploy fairlance-backend \
  --image gcr.io/$PROJECT_ID/fairlance-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,PORT=5001,MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0,JWT_SECRET=your-super-secret-jwt-key,MASCHAIN_API_URL=https://service-testnet.maschain.com,MASCHAIN_API_KEY=your-maschain-api-key,MASCHAIN_API_SECRET=your-maschain-api-secret,CORS_ORIGIN=*"

# Get backend URL
BACKEND_URL=$(gcloud run services describe fairlance-backend --platform managed --region $REGION --format 'value(status.url)')
print_status "Backend deployed at: $BACKEND_URL"

cd ..

# Build and deploy frontend
print_info "Building and deploying frontend..."
cd frontend

# Set environment variables for frontend build
export NEXT_PUBLIC_API_URL="$BACKEND_URL/api"
export NEXT_PUBLIC_APP_NAME="FairLance"
export NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="c4f79cc821944d9680842e34466bfbd"

gcloud builds submit --tag gcr.io/$PROJECT_ID/fairlance-frontend

gcloud run deploy fairlance-frontend \
  --image gcr.io/$PROJECT_ID/fairlance-frontend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api,NEXT_PUBLIC_APP_NAME=FairLance,NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd"

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe fairlance-frontend --platform managed --region $REGION --format 'value(status.url)')
print_status "Frontend deployed at: $FRONTEND_URL"

cd ..

# Update backend CORS with frontend URL
print_info "Updating backend CORS settings..."
gcloud run services update fairlance-backend \
  --platform managed \
  --region $REGION \
  --set-env-vars="NODE_ENV=production,PORT=5001,MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0,JWT_SECRET=your-super-secret-jwt-key,MASCHAIN_API_URL=https://service-testnet.maschain.com,MASCHAIN_API_KEY=your-maschain-api-key,MASCHAIN_API_SECRET=your-maschain-api-secret,CORS_ORIGIN=$FRONTEND_URL"

echo ""
print_status "🎉 Deployment Complete!"
echo "========================"
echo ""
print_info "📱 Frontend: $FRONTEND_URL"
print_info "🔧 Backend:  $BACKEND_URL"
print_info "🔍 Health:   $BACKEND_URL/api/health"
echo ""
print_status "Your FairLance platform is now live on GCP Cloud Run! 🚀"
