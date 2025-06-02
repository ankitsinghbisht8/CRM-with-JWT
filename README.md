# Xeno CRM 🚀

A modern, full-stack Customer Relationship Management (CRM) system built with React and Node.js. Xeno CRM helps businesses manage customers, track orders, create targeted campaigns, and analyze customer behavior with AI-powered insights.

![Xeno CRM Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Redis](https://img.shields.io/badge/Cache-Redis-red)

## 🌟 Features

### Core CRM Functionality
- **Customer Management**: Add, view, and manage customer profiles
- **Order Tracking**: Complete order management system with status tracking
- **Campaign Creation**: Build targeted marketing campaigns with custom segments
- **Real-time Analytics**: Dashboard with live metrics and insights

### Advanced Features
- **AI-Powered Insights**: Google Gemini integration for customer behavior analysis
- **Smart Segmentation**: Rule-based customer segmentation with multiple criteria
- **Campaign Delivery**: Automated campaign delivery with Redis-based queue processing
- **Google OAuth**: Secure authentication with Google Sign-In
- **Real-time Updates**: Live campaign delivery status and analytics

### Technical Features
- **Responsive Design**: Mobile-first, modern UI design
- **RESTful API**: Clean, documented API architecture
- **Background Processing**: Redis streams for campaign delivery
- **Security First**: JWT authentication, input validation, CORS protection
- **Production Ready**: Docker support, comprehensive deployment guides

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Google OAuth** - Authentication
- **CSS3** - Modern styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Redis** - Caching and queue management
- **Google Gemini AI** - AI insights
- **JWT** - Authentication tokens

### DevOps & Deployment
- **Docker** - Containerization
- **Render** - Cloud deployment platform
- **MongoDB Atlas** - Cloud database
- **Redis Cloud** - Managed Redis service

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Cloud Console account
- Google AI Studio account

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/xeno-crm.git
cd xeno-crm
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd xeno-crm-backend
npm install

# Install frontend dependencies
cd ../xeno-crm-frontend
npm install
```

3. **Set up environment variables**

Create `.env` file in `xeno-crm-backend/`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/xenocrm
REDIS_URI=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_32_characters_minimum
```

Create `.env` file in `xeno-crm-frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Start the development servers**

Backend:
```bash
cd xeno-crm-backend
npm run dev
```

Frontend:
```bash
cd xeno-crm-frontend
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker Development

Run the full stack with Docker Compose:

```bash
# Copy and configure environment variables
cp docker-compose.template.yml docker-compose.yml
# Edit docker-compose.yml with your environment variables

# Start all services
docker-compose up --build
```

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Push to GitHub** and connect to Render
2. **Use Blueprint deployment** with the included `render.yaml`
3. **Set environment variables** in Render dashboard
4. **Update Google OAuth** redirect URIs

Detailed deployment guide: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Other Deployment Options
- **Railway**: Automatic deployments from GitHub
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2, ECS, or Elastic Beanstalk
- **Heroku**: Traditional platform deployment

## 📡 API Documentation

### Authentication
```bash
POST /api/auth/google          # Google OAuth login
GET  /api/auth/me              # Get current user
```

### Customers
```bash
GET    /api/customers          # List customers (with pagination)
POST   /api/customers          # Create customer
GET    /api/customers/:id      # Get customer details
PUT    /api/customers/:id      # Update customer
DELETE /api/customers/:id      # Delete customer
```

### Orders
```bash
GET    /api/orders             # List orders (with pagination)
POST   /api/orders             # Create order
GET    /api/orders/:id         # Get order details
PUT    /api/orders/:id         # Update order
```

### Campaigns
```bash
GET    /api/campaigns          # List campaigns
POST   /api/campaigns          # Create campaign
GET    /api/campaigns/:id      # Get campaign details
POST   /api/campaigns/:id/send # Send campaign
```

### AI Insights
```bash
POST   /api/ai/analyze         # Get AI insights for customer data
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `REDIS_URI` | Redis connection string | Yes |
| `GEMINI_API_KEY` | Google AI API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `JWT_SECRET` | JWT signing secret (32+ chars) | Yes |

#### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key for Gemini
3. Add the key to your environment variables

## 📊 Features Overview

### Dashboard
- Customer count and growth metrics
- Order statistics and revenue tracking
- Campaign performance analytics
- Recent activity feed

### Customer Management
- Add new customers with contact information
- View customer details and order history
- Search and filter customer database
- Export customer data

### Campaign System
- Create targeted campaigns with custom segments
- Rule-based customer segmentation
- Real-time campaign delivery tracking
- Delivery receipt processing via Redis streams

### AI Insights
- Customer behavior analysis
- Predictive analytics for customer segments
- Campaign optimization suggestions
- Automated insights generation

## 🔒 Security

- **Authentication**: JWT-based with Google OAuth
- **Authorization**: Route-level protection
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for frontend domain
- **Environment Variables**: Sensitive data in environment variables
- **Rate Limiting**: API rate limiting (configurable)

## 🧪 Testing

Run backend tests:
```bash
cd xeno-crm-backend
npm test
```

Run frontend tests:
```bash
cd xeno-crm-frontend
npm test
```

## 📈 Performance

- **Redis Caching**: Campaign delivery queue and caching
- **Database Indexing**: Optimized MongoDB queries
- **React Optimization**: Code splitting and lazy loading
- **Background Processing**: Non-blocking campaign delivery
- **CDN Ready**: Static assets optimized for CDN delivery

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Redis](https://redis.io/) - Caching and queuing
- [Google AI](https://ai.google.dev/) - AI insights
- [Render](https://render.com/) - Deployment platform

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/xeno-crm/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/xeno-crm/discussions)

---

**Built with ❤️ by [Your Name]**

*Xeno CRM - Empowering businesses with intelligent customer relationships*
