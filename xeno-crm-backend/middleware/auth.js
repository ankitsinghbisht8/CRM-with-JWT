import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('Error: GOOGLE_CLIENT_ID is not set in environment variables');
  process.exit(1);
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log("Hello")
// console.log(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify Google OAuth token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // Add user info to request object
    req.user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;