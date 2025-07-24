import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import CreateSegment from './pages/CreateSegment';
import CampaignHistory from './pages/CampaignHistory';
import Layout from './components/Layout';
import { isAuthenticated, getUser, removeToken } from './utils/auth';
import api from './services/api';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getUser();
        
        if (storedUser) {
          setUser(storedUser);
        } else {
          // If no stored user, fetch from API
          try {
            const response = await api.get('/api/auth/profile');
            if (response.data.success) {
              setUser(response.data.user);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            removeToken();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleUserUpdate = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout user={user} onUserUpdate={handleUserUpdate}>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <Layout user={user} onUserUpdate={handleUserUpdate}>
            <Customers />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout user={user} onUserUpdate={handleUserUpdate}>
            <Orders />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/segments/create" element={
        <ProtectedRoute>
          <Layout user={user} onUserUpdate={handleUserUpdate}>
            <CreateSegment />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/campaigns" element={
        <ProtectedRoute>
          <Layout user={user} onUserUpdate={handleUserUpdate}>
            <CampaignHistory />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;