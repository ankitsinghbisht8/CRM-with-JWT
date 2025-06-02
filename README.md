# Xeno CRM

A modern Customer Relationship Management system built with React and Node.js.

## Setup Instructions

1. Copy the docker-compose template:
   ```bash
   cp docker-compose.template.yml docker-compose.yml
   ```

2. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google OAuth2 API
   - Go to Credentials
   - Create an OAuth 2.0 Client ID
   - Set authorized JavaScript origins to `http://localhost:3001`
   - Set authorized redirect URIs to `http://localhost:3001`
   - Copy the Client ID

3. Update the docker-compose.yml:
   - Replace `${GOOGLE_CLIENT_ID}` with your actual Google Client ID

4. Start the application:
   ```bash
   docker-compose up --build
   ```

5. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5001

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5001)
- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `PORT`: Frontend port (default: 3001)

### Backend
- `PORT`: Backend port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URI`: Redis connection string

## Services

- Frontend: React application (port 3001)
- Backend: Node.js API (port 5001)
- MongoDB: Database (port 27017)
- Redis: Cache (port 6380)
