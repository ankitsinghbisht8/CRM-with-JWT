import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setToken, setUser } from '../utils/auth';
import api from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(endpoint, payload);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user info
        setToken(token);
        setUser(user);
        
        // Redirect to the intended page or dashboard
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(
        error.response?.data?.message || 
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>CRM</h1>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Get started with CRM'}</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              placeholder="Enter your password"
              disabled={loading}
            />
            {!isLogin && (
              <small className="form-text">
                Password must be at least 6 characters long
              </small>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="link-button"
              onClick={toggleMode}
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
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
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 2rem;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .login-header h1 {
          color: #4f46e5;
          margin-bottom: 0.5rem;
          font-size: 2rem;
          font-weight: 700;
        }
        
        .login-header h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .login-header p {
          color: #6b7280;
          margin-bottom: 0;
        }
        
        .login-form {
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #4f46e5;
        }
        
        .form-group input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        
        .form-text {
          display: block;
          margin-top: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }
        
        .btn-primary {
          background-color: #4f46e5;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #4338ca;
        }
        
        .btn-primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        
        .btn-full {
          width: 100%;
        }
        
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        
        .alert-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }
        
        .login-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .login-footer p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
        
        .link-button {
          background: none;
          border: none;
          color: #4f46e5;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
          font-weight: 600;
        }
        
        .link-button:hover:not(:disabled) {
          color: #4338ca;
        }
        
        .link-button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login; 