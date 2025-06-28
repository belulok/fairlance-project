#!/bin/bash

# 🚀 FairLance GCP Cloud Run Deployment Script (Based on Toloong2 Architecture)
set -e

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

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "Not authenticated with Google Cloud. Please run: gcloud auth login"
    exit 1
fi

# Set project variables
PROJECT_ID=${1:-"fairlance-demo-2024"}
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

# Deploy backend using Cloud Build (toloong2 approach)
print_info "Building and deploying backend with Cloud Build..."
cd backend

print_info "Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

# Get backend URL
BACKEND_URL=$(gcloud run services describe fairlance-backend --platform managed --region $REGION --format 'value(status.url)')
print_status "Backend deployed at: $BACKEND_URL"

cd ..

# Deploy frontend using Cloud Build
print_info "Building and deploying frontend with Cloud Build..."
cd frontend

# Update frontend cloudbuild.yaml with backend URL
sed -i.bak "s|NEXT_PUBLIC_API_URL=.*,|NEXT_PUBLIC_API_URL=$BACKEND_URL/api,|g" cloudbuild.yaml

print_info "Building and deploying frontend with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe fairlance-frontend --platform managed --region $REGION --format 'value(status.url)')
print_status "Frontend deployed at: $FRONTEND_URL"

cd ..

# Update backend CORS with frontend URL
print_info "Updating backend CORS settings..."
gcloud run services update fairlance-backend \
  --platform managed \
  --region $REGION \
  --set-env-vars="NODE_ENV=production,PORT=5001,MONGODB_URI=${MONGODB_URI},JWT_SECRET=${JWT_SECRET},MASCHAIN_API_URL=https://service-testnet.maschain.com,MASCHAIN_API_KEY=${MASCHAIN_API_KEY},MASCHAIN_API_SECRET=${MASCHAIN_API_SECRET},CORS_ORIGIN=$FRONTEND_URL"

# Test the deployments (toloong2 approach)
print_info "Testing the deployments..."

# Test backend health
if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
    print_status "Backend health check passed!"
else
    print_error "Backend health check failed. Please check the logs."
    print_warning "To view logs, run: gcloud logs read --service=fairlance-backend --region=$REGION"
fi

# Test frontend
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    print_status "Frontend health check passed!"
else
    print_error "Frontend health check failed. Please check the logs."
    print_warning "To view logs, run: gcloud logs read --service=fairlance-frontend --region=$REGION"
fi

echo ""
print_status "🎉 Deployment Complete!"
echo "========================"
echo ""
print_info "📱 Frontend: $FRONTEND_URL"
print_info "🔧 Backend:  $BACKEND_URL"
print_info "🔍 Health:   $BACKEND_URL/api/health"
echo ""
print_status "Your FairLance platform is now live on GCP Cloud Run! 🚀"
echo ""
print_warning "📝 Next steps:"
echo "1. Update MetaMask to connect to your live frontend"
echo "2. Test wallet connection and Web3 features"
echo "3. Deploy smart contracts to testnet"
echo "4. Update contract addresses in environment variables"
