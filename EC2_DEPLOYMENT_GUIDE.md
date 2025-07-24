# EC2 Deployment Guide for Xeno CRM

## Your EC2 Instance Configuration
- **IP Address:** 54.177.168.131
- **Backend Port:** 5000
- **Frontend Port:** 3000

## Prerequisites on EC2 Instance

1. **Update system packages:**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js and npm:**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

3. **Install Git (if not already installed):**
```bash
sudo apt install git -y
```

4. **Install PM2 for process management:**
```bash
sudo npm install -g pm2
```

## Step 1: Clone and Setup Application

```bash
# Clone your repository
git clone <your-repo-url>
cd "CRM Without OAuth"

# Install backend dependencies
cd xeno-crm-backend
npm install
cd ..

# Install frontend dependencies
cd xeno-crm-frontend
npm install
cd ..
```

## Step 2: Configure Environment Variables

### Backend Environment (.env in xeno-crm-backend/)
Create the `.env` file using the template:

```bash
cd xeno-crm-backend
cp ec2-env-config.txt .env
nano .env
```

Replace the placeholder values with your actual credentials:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_actual_mongodb_uri
REDIS_URI=your_actual_redis_uri
GEMINI_API_KEY=your_actual_gemini_api_key
JWT_SECRET=your_actual_jwt_secret_32_chars_minimum
```

### Frontend Environment (.env in xeno-crm-frontend/)
```bash
cd ../xeno-crm-frontend
cp ec2-env-config.txt .env
```

The frontend .env should contain:
```env
REACT_APP_API_URL=http://54.177.168.131:5000
```

## Step 3: Build Frontend

```bash
cd xeno-crm-frontend
npm run build
cd ..
```

## Step 4: Configure EC2 Security Group

Make sure your EC2 security group allows inbound traffic on:
- **Port 22:** SSH access
- **Port 5000:** Backend API
- **Port 3000:** Frontend (if serving React directly)
- **Port 80:** HTTP (optional, for production setup)
- **Port 443:** HTTPS (optional, for production setup)

## Step 5: Start the Application

### Option A: Using PM2 (Recommended for production)

```bash
# Start backend
cd xeno-crm-backend
pm2 start server.js --name "xeno-backend"

# Start frontend (serve the built files)
cd ../xeno-crm-frontend
pm2 serve build 3000 --name "xeno-frontend" --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option B: Direct execution (for testing)

```bash
# Terminal 1: Start backend
cd xeno-crm-backend
npm start

# Terminal 2: Start frontend
cd xeno-crm-frontend
npx serve -s build -l 3000
```

## Step 6: Access Your Application

- **Frontend:** http://54.177.168.131:3000
- **Backend API:** http://54.177.168.131:5000
- **Health Check:** http://54.177.168.131:5000/api/health

## Step 7: Verify Configuration

1. **Test backend health:**
```bash
curl http://54.177.168.131:5000/api/health
```

2. **Check PM2 status:**
```bash
pm2 status
pm2 logs
```

3. **Test frontend access:**
Open browser and navigate to http://54.177.168.131:3000

## Troubleshooting

### Backend not accessible:
- Check if port 5000 is open in security group
- Verify backend is running: `pm2 status`
- Check logs: `pm2 logs xeno-backend`

### Frontend not loading:
- Check if port 3000 is open in security group
- Verify build was successful: `ls xeno-crm-frontend/build`
- Check logs: `pm2 logs xeno-frontend`

### CORS errors:
- Verify CORS configuration in backend includes your frontend URL
- Check that frontend .env has correct backend URL

### Database connection issues:
- Verify MongoDB URI in backend .env
- Check if MongoDB Atlas allows connections from EC2 IP
- Test connection: `node -e "console.log(process.env.MONGODB_URI)"`

## Production Optimizations

1. **Use Nginx as reverse proxy:**
```bash
sudo apt install nginx -y
```

2. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

3. **Configure automatic restarts:**
```bash
pm2 startup
pm2 save
```

4. **Monitor logs:**
```bash
pm2 monit
```

## Changes Made for EC2 Deployment

1. ✅ Updated frontend API URL to point to EC2 IP
2. ✅ Configured backend CORS to allow EC2 frontend
3. ✅ Removed localhost proxy from frontend package.json
4. ✅ Updated backend to listen on all interfaces (0.0.0.0)
5. ✅ Created environment configuration templates

Your application is now configured to run on EC2 instance 54.177.168.131! 