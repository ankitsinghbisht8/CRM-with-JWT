import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalCampaigns: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const [customersRes, ordersRes, campaignsRes] = await Promise.all([
        api.get('/api/customers?limit=1'),
        api.get('/api/orders?limit=1'),
        api.get('/api/campaigns?limit=5')
      ]);
      
      setStats({
        totalCustomers: customersRes.data.total || 0,
        totalOrders: ordersRes.data.total || 0,
        totalCampaigns: campaignsRes.data.total || 0,
        recentActivity: campaignsRes.data.campaigns || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your CRM overview</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{stats.totalCampaigns}</h3>
            <p>Total Campaigns</p>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <div className="card">
          <h2>Recent Campaigns</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="activity-list">
              {stats.recentActivity.map((campaign) => (
                <div key={campaign._id} className="activity-item">
                  <div className="activity-content">
                    <h4>{campaign.name}</h4>
                    <p>{campaign.description || 'No description'}</p>
                    <div className="activity-meta">
                      <span className={`status-badge status-${campaign.status}`}>
                        {campaign.status}
                      </span>
                      <span className="activity-date">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="activity-stats">
                    <div className="stat">
                      <span className="stat-value">{campaign.sentCount}</span>
                      <span className="stat-label">Sent</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{campaign.deliveredCount}</span>
                      <span className="stat-label">Delivered</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent campaigns</p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .dashboard {
          padding: 0;
        }
        
        .dashboard-header {
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .dashboard-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        
        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eef2ff;
          border-radius: 12px;
        }
        
        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .stat-content p {
          color: #6b7280;
          font-weight: 500;
        }
        
        .recent-activity h2 {
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #fafafa;
        }
        
        .activity-content h4 {
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .activity-content p {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .activity-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-draft {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        .status-in-progress {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .status-completed {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .status-failed {
          background-color: #fee2e2;
          color: #dc2626;
        }
        
        .activity-date {
          color: #9ca3af;
          font-size: 0.75rem;
        }
        
        .activity-stats {
          display: flex;
          gap: 1rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .no-data {
          color: #9ca3af;
          text-align: center;
          padding: 2rem;
        }
        
        .dashboard-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;