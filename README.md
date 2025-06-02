# CRM 🚀

A modern, full-stack Customer Relationship Management (CRM) system built with React and Node.js. Xeno CRM helps businesses manage customers, track orders, create targeted campaigns, and analyze customer behavior with AI-powered insights.

![CRM Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Redis](https://img.shields.io/badge/Cache-Redis-red)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-yellow)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│   MongoDB       │
│   (Port 3001)   │    │  (Port 5001)    │    │   (Atlas)       │
│                 │    │                 │    │                 │
│ • Google OAuth  │    │ • RESTful API   │    │ • Customer Data │
│ • Dashboard     │    │ • JWT Auth      │    │ • Orders        │
│ • Campaign UI   │    │ • AI Integration│    │ • Campaigns     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis Cloud   │    │  Google Gemini  │
                       │                 │    │      AI         │
                       │ • Campaign      │    │                 │
                       │   Processing    │    │ • Message       │
                       │ • Delivery      │    │   Generation    │
                       │   Tracking      │    │ • Campaign      │
                       │ • Async Jobs    │    │   Optimization  │
                       └─────────────────┘    └─────────────────┘

Background Workers:
┌─────────────────┐    ┌─────────────────┐
│ Customer Data   │    │ Delivery        │
│ Consumer        │    │ Consumer        │
│                 │    │                 │
│ • Processes     │    │ • Handles       │
│   customer      │    │   campaign      │
│   updates       │    │   delivery      │
│                 │    │   receipts      │
└─────────────────┘    └─────────────────┘
```

## 🌟 Features

### Core CRM Functionality
- **Customer Management**: Add, view, and manage customer profiles with search/filter
- **Order Tracking**: Complete order management system with status tracking
- **Campaign Creation**: Build targeted marketing campaigns with custom segments
- **Real-time Analytics**: Dashboard with live metrics and insights

### Advanced Features
- **AI-Powered Message Generation**: Google Gemini integration for creative campaign content
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

## 🛠️ Tech Stack & AI Tools

### Frontend Technologies
- **React 18** - Modern JavaScript library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Google OAuth** - Authentication integration
- **CSS3** - Modern styling with Flexbox/Grid, responsive design

### Backend Technologies
- **Node.js 18+** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - Document-based NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis** - In-memory data structure store for caching and queues
- **JWT** - JSON Web Tokens for stateless authentication

### AI & Machine Learning
- **Google Gemini 1.5 Flash** - Advanced AI for:
  - Campaign message generation
  - Content optimization
  - Marketing copy suggestions
  - Audience-specific messaging
- **AI Features**:
  - Natural language processing for campaign content
  - Contextual message generation based on campaign goals
  - Tone adaptation (professional, friendly, urgent)
  - 160-character optimized messages for SMS/social

### Cloud Services & DevOps
- **MongoDB Atlas** - Managed MongoDB hosting
- **Redis Cloud** - Managed Redis hosting
- **Google Cloud Platform** - OAuth and AI services
- **Docker & Docker Compose** - Containerization
- **Render** - Primary deployment platform

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Nodemon** - Development server auto-restart
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (recommended)
- MongoDB (local or Atlas account)
- Redis (local or cloud account)
- Google Cloud Console account
- Google AI Studio account

### Option 1: Docker Development (Recommended)

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd xeno-crm
```

2. **Set up environment variables**

Create `.env` file in `xeno-crm-backend/`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_32_characters_minimum
```

Create `.env` file in `xeno-crm-frontend/`:
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Run with Docker**
```bash
# Update docker-compose.yml with your environment variables
# Then start all services
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001

### Option 2: Manual Development Setup

1. **Install dependencies**
```bash
# Backend dependencies
cd xeno-crm-backend
npm install

# Frontend dependencies
cd ../xeno-crm-frontend
npm install
cd ..
```

2. **Set up environment variables** (same as Docker option)

3. **Start services manually**
```bash
# Terminal 1: Start backend
cd xeno-crm-backend
npm run dev

# Terminal 2: Start frontend
cd xeno-crm-frontend
npm start

# Terminal 3: Start Redis consumers (for campaign processing)
cd xeno-crm-backend
npm run workers
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Required Service Setup

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000` and `http://localhost:3001` (development)
   - Your production domain

#### Google AI Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key for Gemini
3. Add the key to your environment variables

#### Database Setup
- **MongoDB Atlas**: Create a cluster and get connection string
- **Redis Cloud**: Create a database and get connection string

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Push to GitHub** and connect to Render
2. **Use Blueprint deployment** with the included `render.yaml`
3. **Set environment variables** in Render dashboard
4. **Update Google OAuth** redirect URIs for production domain

Detailed deployment guide: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

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

### AI Features
```bash
POST   /api/generate-messages  # Generate AI campaign messages
POST   /api/ai/analyze         # Get AI insights for customer data
```

### Segmentation
```bash
POST   /api/segment/preview    # Preview customer segment
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | `development` | Yes |
| `PORT` | Server port | `5000` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` | Yes |
| `REDIS_URI` | Redis connection string | `redis://...` | Yes |
| `GEMINI_API_KEY` | Google AI API key | `AIz...` | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123...` | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GXY...` | Yes |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your-secret-key` | Yes |

#### Frontend (.env)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001` | Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | `123...` | Yes |

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
- Rule-based customer segmentation (spending, orders, location)
- AI-powered message generation with tone customization
- Real-time campaign delivery tracking
- Delivery receipt processing via Redis streams
- Campaign analytics and performance metrics

### AI-Powered Features
- **Message Generation**: Contextual campaign messages based on goals and audience
- **Tone Adaptation**: Professional, friendly, or urgent messaging styles
- **Content Optimization**: 160-character optimized messages
- **Audience Analysis**: AI insights for customer segments

## 🔒 Security Features

- **Authentication**: JWT-based with Google OAuth integration
- **Authorization**: Route-level protection and user verification
- **Input Validation**: Server-side validation for all API inputs
- **CORS**: Configured for specific frontend domains
- **Environment Variables**: All sensitive data externalized
- **Rate Limiting**: API rate limiting (configurable)
- **Password Security**: No plain text storage, OAuth-only authentication

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

## 📈 Performance Features

- **Redis Caching**: Campaign delivery queue and session caching
- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **React Optimization**: Code splitting and lazy loading
- **Background Processing**: Non-blocking campaign delivery via Redis streams
- **CDN Ready**: Static assets optimized for CDN delivery
- **Connection Pooling**: Efficient database connection management

## ⚠️ Known Limitations & Assumptions

### Current Limitations
1. **Campaign Delivery Simulation**: Uses simulated delivery vendors (90% success rate) instead of real SMS/email providers
2. **Real-time Updates**: Customer creation may have slight delays due to Redis stream processing
3. **File Uploads**: No image upload functionality for customer profiles
4. **Campaign Scheduling**: No advanced scheduling features (campaigns send immediately)
5. **Analytics**: Basic analytics only - no advanced reporting or data visualization
6. **Mobile App**: Web-only interface, no native mobile application

### Assumptions
1. **Authentication**: Assumes Google accounts for all users (no email/password registration)
2. **Data Volume**: Optimized for small to medium businesses (< 100k customers)
3. **Single Tenant**: Designed as single-tenant application per deployment
4. **Network**: Assumes reliable internet connection for Redis/MongoDB cloud services
5. **Browser Support**: Modern browsers with ES6+ support required
6. **Campaign Types**: Focuses on text-based campaigns only

### Future Enhancement Areas
- Integration with real SMS/email providers (Twilio, SendGrid)
- Advanced analytics and reporting dashboard
- Campaign scheduling and automation
- File upload capabilities
- Multi-tenant architecture
- Mobile application development
- A/B testing for campaigns
- Advanced customer segmentation with ML

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
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Redis](https://redis.io/) - Caching and queuing
- [Google AI](https://ai.google.dev/) - AI insights and generation
- [Render](https://render.com/) - Deployment platform

## 📞 Support

- **Documentation**: Check the repository for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Security**: For security issues, please email directly instead of public issues

---

**Built with ❤️ for modern customer relationship management**

*CRM - Empowering businesses with intelligent customer relationships*
