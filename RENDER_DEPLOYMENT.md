# Deploy Xeno CRM to Render

This guide will help you deploy your Xeno CRM application to Render using the existing `render.yaml` configuration.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **External Services**: 
   - MongoDB Atlas account with database set up
   - Redis Cloud account with instance created
   - Google OAuth credentials configured

## Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub
2. Make sure the `render.yaml` file is in your repository root
3. Verify that both `xeno-crm-frontend` and `xeno-crm-backend` directories exist

## Step 2: Connect Repository to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select your repository containing the Xeno CRM code
5. Render will automatically detect the `render.yaml` file

## Step 3: Configure Environment Variables

Render will create both services but you need to set the environment variables. For each service:

### Backend Environment Variables

Go to your backend service settings and add these environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xenocrm?retryWrites=true&w=majority
REDIS_URI=rediss://username:password@host:port
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
```

### Frontend Environment Variables

The frontend service already has these configured in `render.yaml`:

```bash
REACT_APP_API_URL=https://xeno-crm-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**⚠️ Important**: You'll need to update the `render.yaml` file to use your actual Google Client ID instead of the placeholder.

## Step 4: Update Backend URL

1. Wait for your backend service to deploy
2. Note the URL assigned to your backend (e.g., `https://xeno-crm-backend-xyz.onrender.com`)
3. Update the frontend environment variable `REACT_APP_API_URL` with the actual backend URL

## Step 5: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 client
4. Add your Render URLs to authorized origins and redirect URIs:
   - **Authorized JavaScript origins**:
     - `https://your-frontend-url.onrender.com`
   - **Authorized redirect URIs**:
     - `https://your-frontend-url.onrender.com`

## Step 6: Deploy

1. Click **"Create Blueprint"** in Render
2. Both services will start building automatically
3. Monitor the build logs for any errors

## Build Process

### Backend Build:
- Runs `cd xeno-crm-backend && npm install`
- Starts with `cd xeno-crm-backend && npm start`

### Frontend Build:
- Runs `cd xeno-crm-frontend && npm install && npm run build`
- Serves static files from `xeno-crm-frontend/build`

## Post-Deployment Setup

### 1. Seed Database (Optional)
If you need to seed your database with initial data:

```bash
# From your backend service shell (available in Render dashboard)
npm run seed
npm run seed:orders
```

### 2. Test the Application
1. Visit your frontend URL
2. Test Google OAuth login
3. Verify all features work correctly

## Environment Variables Reference

Create a `.env` file locally for reference:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xenocrm?retryWrites=true&w=majority

# Redis
REDIS_URI=rediss://username:password@host:port

# AI
GEMINI_API_KEY=your_gemini_api_key_here

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Security
JWT_SECRET=your_jwt_secret_here_minimum_32_characters

# Environment
NODE_ENV=production
PORT=5000
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Environment Variables**:
   - Double-check all required variables are set
   - Ensure no trailing spaces in values
   - Verify MongoDB and Redis URIs are correct

3. **CORS Issues**:
   - Ensure backend URL is correctly set in frontend
   - Check Google OAuth redirect URIs

4. **Database Connection**:
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Test connection string locally first

5. **Google OAuth**:
   - Ensure client ID is correct in both frontend and backend
   - Verify redirect URIs match exactly

### Viewing Logs:
- Go to your service in Render dashboard
- Click on **"Logs"** tab to see runtime logs
- Use **"Events"** tab to see deployment history

## Custom Domain (Optional)

1. Go to your frontend service settings
2. Click **"Custom Domains"**
3. Add your domain and follow DNS instructions

## Performance Tips

1. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - Cold starts may take 30+ seconds
   - Consider upgrading to paid plans for production

2. **Optimization**:
   - Enable compression in Express backend
   - Optimize React bundle size
   - Use caching strategies

## Security Checklist

✅ Environment variables are set (not hardcoded)
✅ MongoDB Atlas network access configured
✅ Google OAuth redirect URIs updated
✅ Strong JWT secret generated
✅ HTTPS enabled (automatic on Render)
✅ CORS properly configured

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check service logs for debugging information

---

Your Xeno CRM application should now be successfully deployed on Render! 🚀 