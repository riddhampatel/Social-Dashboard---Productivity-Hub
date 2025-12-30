# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Push your code to GitHub

## Step 1: Deploy Backend

1. **Go to Vercel Dashboard** → New Project
2. **Import your GitHub repository**
3. **Configure Backend:**
   - Root Directory: `backend`
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   MONGODB_URI=mongodb+srv://jarryteach38:jarry234@m0.j5e0awq.mongodb.net/social-dashboard?retryWrites=true&w=majority&appName=M0
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Click Deploy**

6. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

## Step 2: Deploy Frontend

1. **Create `.env` file in frontend folder:**
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

2. **Push to GitHub**

3. **Go to Vercel Dashboard** → New Project
4. **Import your GitHub repository**
5. **Configure Frontend:**
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

7. **Click Deploy**

## Step 3: Update Backend CLIENT_URL

1. Go to your backend Vercel project
2. Go to Settings → Environment Variables
3. Update `CLIENT_URL` with your frontend URL
4. Redeploy

## Step 4: MongoDB Atlas Network Access

1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

## Testing

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Register a new account
3. Test all features

## Important Notes

- Backend and Frontend are deployed separately
- Both need their own environment variables
- Make sure MongoDB allows connections from anywhere (0.0.0.0/0)
- Backend URL must end with `/api` in VITE_API_URL

## Troubleshooting

**Backend errors:**
- Check Environment Variables are set correctly
- Check MongoDB connection string
- Check logs in Vercel dashboard

**Frontend errors:**
- Make sure VITE_API_URL points to backend
- Check if backend is deployed and running
- Check browser console for CORS errors
