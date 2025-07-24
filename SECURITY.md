# Security Guidelines

## 🔐 Environment Variables

**NEVER** commit sensitive data to Git. All secrets must be stored in environment variables:

### Required Environment Variables

#### Backend (`.env` in `xeno-crm-backend/`)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_minimum_32_characters
```

#### Frontend (`.env` in `xeno-crm-frontend/`)
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 🚨 Before Pushing to GitHub

1. **Check for secrets**: Run `git diff --cached` to review staged changes
2. **Verify .gitignore**: Ensure all `.env` files are excluded
3. **Use .env.example**: Provide example files with placeholder values
4. **Never commit**:
   - `.env` files
   - `docker-compose.yml` with real credentials
   - Database connection strings
   - API keys or tokens

## 🛡️ Production Security

1. **Environment Variables**: Set all secrets in your deployment platform
2. **JWT Secret**: Use a strong, randomly generated secret (32+ characters)
3. **Database Access**: Restrict database access by IP when possible
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS for your specific domain
6. **Rate Limiting**: Implement rate limiting for API endpoints

## 🔍 Security Checklist

- [ ] No hardcoded secrets in code
- [ ] All `.env` files in `.gitignore`
- [ ] Strong JWT secret (32+ characters)
- [ ] Database access restricted
- [ ] CORS properly configured
- [ ] HTTPS enabled in production
- [ ] Dependencies regularly updated
- [ ] Input validation on all endpoints

## 📞 Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers. 