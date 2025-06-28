# 🚀 GCP Cloud Run Deployment Guide

## 🎯 **Why GCP Cloud Run?**

### **✅ Advantages over Vercel/Railway**
- **No build issues** with complex dependencies (RainbowKit works perfectly)
- **Full Docker control** over environment
- **Both services** in one platform
- **Professional URLs** for hackathon demo
- **Generous free tier** ($300 credit + always-free tier)
- **Auto-scaling** from 0 to 1000+ instances
- **Custom domains** and SSL certificates

---

## 🛠️ **Prerequisites**

### **1. Google Cloud Account**
- Sign up at: https://cloud.google.com/
- Get $300 free credit for new accounts
- Enable billing (required for Cloud Run)

### **2. Install Google Cloud CLI**
```bash
# macOS
brew install --cask google-cloud-sdk

# Windows
# Download from: https://cloud.google.com/sdk/docs/install

# Linux
curl https://sdk.cloud.google.com | bash
```

### **3. Authenticate**
```bash
gcloud auth login
gcloud auth configure-docker
```

---

## 🚀 **Quick Deployment (5 minutes)**

### **Option 1: Automated Script**
```bash
# Create new GCP project (optional)
gcloud projects create fairlance-demo --name="FairLance Demo"

# Deploy everything
./deploy-gcp.sh fairlance-demo us-central1
```

### **Option 2: Manual Deployment**

#### **Step 1: Setup Project**
```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

#### **Step 2: Deploy Backend**
```bash
cd backend

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/fairlance-backend

# Deploy to Cloud Run
gcloud run deploy fairlance-backend \
  --image gcr.io/YOUR_PROJECT_ID/fairlance-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0"
```

#### **Step 3: Deploy Frontend**
```bash
cd ../frontend

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/fairlance-frontend

# Deploy to Cloud Run
gcloud run deploy fairlance-frontend \
  --image gcr.io/YOUR_PROJECT_ID/fairlance-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL/api"
```

---

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend**
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://admin:1234567890@cluster0.l9lsqjb.mongodb.net/fairlance?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret
CORS_ORIGIN=https://your-frontend-url
```

#### **Frontend**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
NEXT_PUBLIC_APP_NAME=FairLance
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...your-contract
```

---

## 💰 **Cost Estimation**

### **Free Tier Limits**
- **Cloud Run**: 2 million requests/month
- **Cloud Build**: 120 build-minutes/day
- **Container Registry**: 0.5GB storage

### **Expected Costs for Demo**
- **Hackathon demo**: $0 (within free tier)
- **Light production**: $5-10/month
- **Heavy usage**: $20-50/month

---

## 🎯 **Expected Results**

After deployment, you'll have:
- **Frontend**: `https://fairlance-frontend-xxx-uc.a.run.app`
- **Backend**: `https://fairlance-backend-xxx-uc.a.run.app`
- **Health Check**: `https://fairlance-backend-xxx-uc.a.run.app/api/health`

---

## 🔍 **Monitoring & Debugging**

### **View Logs**
```bash
# Backend logs
gcloud run services logs read fairlance-backend --region us-central1

# Frontend logs
gcloud run services logs read fairlance-frontend --region us-central1
```

### **Check Service Status**
```bash
gcloud run services list --region us-central1
```

### **Update Environment Variables**
```bash
gcloud run services update fairlance-backend \
  --set-env-vars="NEW_VAR=value" \
  --region us-central1
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Fails**
```bash
# Check build logs
gcloud builds log BUILD_ID
```

#### **Service Won't Start**
```bash
# Check service logs
gcloud run services logs read SERVICE_NAME --region REGION
```

#### **CORS Issues**
- Update `CORS_ORIGIN` environment variable
- Ensure frontend URL is correct

### **Quick Fixes**
```bash
# Redeploy service
gcloud run services replace service.yaml --region us-central1

# Delete and recreate
gcloud run services delete SERVICE_NAME --region us-central1
```

---

## 🎉 **Success Checklist**

After deployment, verify:
- ✅ Frontend loads without errors
- ✅ Backend API responds at `/api/health`
- ✅ MetaMask wallet connects
- ✅ No CORS errors in browser console
- ✅ MongoDB connection works
- ✅ All environment variables set correctly

**Your FairLance platform is now running on enterprise-grade infrastructure! 🚀**
