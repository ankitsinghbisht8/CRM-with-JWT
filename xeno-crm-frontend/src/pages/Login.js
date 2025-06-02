import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
import api from '../services/api';

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verify Google Client ID is available
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      console.error('Error: REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
      setError('Authentication configuration error. Please contact support.');
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/auth/google', {
        token: credentialResponse.credential
      });
      
      const { user, token } = response.data;
      
      // Store token and user info
      setToken(token);
      setUser(user);
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  // If Google Client ID is not available, show error message
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    return (
      <div className="login-container">
        <div className="login-card card">
          <div className="login-header">
            <h1>Configuration Error</h1>
            <p>Authentication is not properly configured. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <h1>Welcome to Xeno CRM</h1>
          <p>Sign in with your Google account to continue</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <div className="login-form">
          {loading ? (
            <div className="loading">
              <p>Signing you in...</p>
            </div>
          ) : (
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          )}
        </div>
        
        <div className="login-footer">
          <p>
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        
        .login-header h1 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 2rem;
          font-weight: 700;
        }
        
        .login-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .login-form {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }
        
        .loading {
          padding: 1rem;
          color: #6b7280;
        }
        
        .login-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .login-footer p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Login;