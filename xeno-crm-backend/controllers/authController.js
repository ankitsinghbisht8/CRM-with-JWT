import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token and return user info
export const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // In a real app, you might want to:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate a JWT or session token
    
    res.status(200).json({
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      // In a real app, you would generate and return a JWT here
      token: token // Re-using Google token for simplicity
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  try {
    // The auth middleware already verified the token and added user info to req.user
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Error getting user info', error: error.message });
  }
};