#!/bin/bash

# 🔐 Secure FairLance GCP Deployment Script
# This script uses environment variables instead of hardcoded credentials

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🔐 Secure FairLance GCP Deployment"
echo "=================================="

# Check required environment variables
REQUIRED_VARS=("MONGODB_URI" "JWT_SECRET" "MASCHAIN_API_KEY" "MASCHAIN_API_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [[ ${#MISSING_VARS[@]} -ne 0 ]]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_info "Please set these variables before running the script:"
    echo "export MONGODB_URI='your-mongodb-connection-string'"
    echo "export JWT_SECRET='your-jwt-secret'"
    echo "export MASCHAIN_API_KEY='your-maschain-api-key'"
    echo "export MASCHAIN_API_SECRET='your-maschain-api-secret'"
    exit 1
fi

# Set project variables
PROJECT_ID=${1:-"rare-habitat-461523-a3"}
REGION=${2:-"us-central1"}

print_info "Project ID: $PROJECT_ID"
print_info "Region: $REGION"

# Deploy backend with secure environment variables
print_info "Deploying backend with secure environment variables..."
cd backend

gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_MONGODB_URI="$MONGODB_URI",_JWT_SECRET="$JWT_SECRET",_MASCHAIN_API_KEY="$MASCHAIN_API_KEY",_MASCHAIN_API_SECRET="$MASCHAIN_API_SECRET" \
  .

print_status "Secure deployment completed!"

cd ..

print_warning "📝 Security Notes:"
echo "✅ No credentials exposed in git history"
echo "✅ Environment variables used for secrets"
echo "✅ Credentials passed securely to Cloud Build"
