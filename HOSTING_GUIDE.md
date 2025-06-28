# 🚀 FairLance Hosting Guide - Free Deployment

## 🎯 **Recommended Setup (100% Free)**

### **Frontend**: Vercel (Perfect for Next.js)
### **Backend**: Railway (Node.js + MongoDB)
### **Database**: MongoDB Atlas (Free tier)

---

## 🎨 **Frontend Deployment (Vercel)**

### **Step 1: Prepare Frontend**
```bash
cd frontend

# Update API URL for production
echo "NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api" > .env.production
echo "NEXT_PUBLIC_APP_NAME=FairLance" >> .env.production
echo "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=c4f79cc821944d9680842e34466bfbd" >> .env.production
```

### **Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **Step 3: Vercel Configuration**
When prompted:
- **Set up and deploy**: `Y`
- **Which scope**: Choose your account
- **Link to existing project**: `N`
- **Project name**: `fairlance-frontend`
- **Directory**: `./` (current directory)
- **Override settings**: `N`

### **Expected Result**
- **URL**: `https://fairlance-frontend.vercel.app`
- **Deploy time**: ~2 minutes
- **Auto-deploy**: Every GitHub push

---

## 🔧 **Backend Deployment (Railway)**

### **Step 1: Setup Railway**
1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. **Connect** your repository
4. **Select** backend folder

### **Step 2: Railway Configuration**
```bash
# Create railway.json in backend folder
cd backend
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server-simple.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

### **Step 3: Environment Variables**
Add these in Railway dashboard:
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fairlance
JWT_SECRET=your-super-secret-jwt-key
MASCHAIN_API_URL=https://service-testnet.maschain.com
MASCHAIN_API_KEY=your-maschain-api-key
MASCHAIN_API_SECRET=your-maschain-api-secret
CORS_ORIGIN=https://fairlance-frontend.vercel.app
```

### **Expected Result**
- **URL**: `https://your-backend.up.railway.app`
- **Deploy time**: ~3-5 minutes
- **Auto-deploy**: Every GitHub push

---

## 🗄️ **Database Setup (MongoDB Atlas)**

### **Step 1: Create Atlas Account**
1. **Visit**: https://www.mongodb.com/atlas
2. **Sign up** for free
3. **Create** new cluster (M0 Sandbox - FREE)

### **Step 2: Configure Database**
1. **Database Access**: Create user with read/write permissions
2. **Network Access**: Add `0.0.0.0/0` (allow all IPs)
3. **Connect**: Get connection string

### **Step 3: Load Sample Data**
```bash
# Connect to your local MongoDB and export data
mongodump --db fairlance --out ./backup

# Import to Atlas (replace with your connection string)
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net" --db fairlance ./backup/fairlance
```

---

## 🔗 **Alternative Hosting Options**

### **Frontend Alternatives**

#### **Netlify** (Great alternative)
```bash
cd frontend
npm run build
# Drag & drop 'out' folder to netlify.com
```

#### **GitHub Pages** (Static only)
```bash
cd frontend
npm run build
npm run export
# Push 'out' folder to gh-pages branch
```

### **Backend Alternatives**

#### **Render** (Good free tier)
1. **Connect** GitHub repo
2. **Select** backend folder
3. **Build command**: `npm install`
4. **Start command**: `node server-simple.js`

#### **Cyclic** (Simple deployment)
1. **Visit**: https://cyclic.sh
2. **Connect** GitHub repo
3. **Auto-deploy** from main branch

---

## 🚀 **Quick Deployment Commands**

### **Deploy Everything (5 minutes)**
```bash
# 1. Deploy Frontend to Vercel
cd frontend
vercel --prod

# 2. Setup MongoDB Atlas (manual - 2 minutes)
# Visit https://www.mongodb.com/atlas

# 3. Deploy Backend to Railway (manual - 3 minutes)  
# Visit https://railway.app

# 4. Update frontend with backend URL
echo "NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api" > .env.production
vercel --prod
```

---

## 🎯 **Hackathon Demo URLs**

After deployment, you'll have:
- **Frontend**: `https://fairlance-frontend.vercel.app`
- **Backend API**: `https://your-backend.up.railway.app/api`
- **Health Check**: `https://your-backend.up.railway.app/api/health`

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Frontend Build Errors**
```bash
# Fix TypeScript errors
cd frontend
npm run build
# Fix any errors shown
```

#### **Backend Connection Issues**
- Check MongoDB Atlas IP whitelist
- Verify environment variables in Railway
- Check CORS_ORIGIN matches frontend URL

#### **API Not Working**
```bash
# Test backend directly
curl https://your-backend.up.railway.app/api/health
```

### **Environment Variables Checklist**
- ✅ Frontend: `NEXT_PUBLIC_API_URL` points to Railway backend
- ✅ Backend: `MONGODB_URI` points to Atlas cluster
- ✅ Backend: `CORS_ORIGIN` matches Vercel frontend URL

---

## 💰 **Cost Breakdown (All FREE)**

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Unlimited personal projects | 100GB bandwidth |
| **Railway** | $5 credit/month | Usually enough for demos |
| **MongoDB Atlas** | 512MB storage | Perfect for hackathons |
| **Total Cost** | **$0/month** | Sufficient for demo |

---

## 🎉 **Success Checklist**

After deployment, verify:
- ✅ Frontend loads at Vercel URL
- ✅ Backend responds at Railway URL
- ✅ API endpoints return data
- ✅ MetaMask wallet connects
- ✅ No CORS errors in browser console

**Your FairLance platform is now live and ready for the hackathon! 🚀**

---

## 📞 **Support Resources**

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Deployment Issues**: Check GitHub Actions or platform logs
