import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import CreateSegment from './pages/CreateSegment';
import CampaignHistory from './pages/CampaignHistory';
import Layout from './components/Layout';
import { isAuthenticated } from './utils/auth';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Routes>
      
      <Route path="/login" element={<Login setUser={setUser} />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout user={user}>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <Layout user={user}>
            <Customers />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout user={user}>
            <Orders />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/segments/create" element={
        <ProtectedRoute>
          <Layout user={user}>
            <CreateSegment />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/campaigns" element={
        <ProtectedRoute>
          <Layout user={user}>
            <CampaignHistory />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;