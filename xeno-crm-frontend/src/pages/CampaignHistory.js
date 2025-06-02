import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCampaigns();
  }, [pagination.currentPage]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/campaigns?page=${pagination.currentPage}&limit=10&sort=-createdAt`);
      
      setCampaigns(response.data.campaigns);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'scheduled': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDeliveryRate = (campaign) => {
    if (campaign.sentCount === 0) return 0;
    return Math.round((campaign.deliveredCount / campaign.sentCount) * 100);
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="loading-container">
        <p>Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="campaign-history">
      <div className="page-header">
        <div>
          <h1>Campaign History</h1>
          <p>View and manage your marketing campaigns</p>
        </div>
        <Link to="/segments/create" className="btn btn-primary">
          Create New Campaign
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-content">
            <h3>No campaigns yet</h3>
            <p>Create your first campaign to start engaging with your customers</p>
            <Link to="/segments/create" className="btn btn-primary">
              Create Campaign
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="campaign-card card">
                <div className="campaign-header">
                  <div className="campaign-title">
                    <h3>{campaign.name}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(campaign.status) }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="campaign-date">
                    {formatDate(campaign.createdAt)}
                  </div>
                </div>

                {campaign.description && (
                  <div className="campaign-description">
                    <p>{campaign.description}</p>
                  </div>
                )}

                <div className="campaign-message">
                  <h4>Message:</h4>
                  <p>"{campaign.message}"</p>
                </div>

                <div className="campaign-stats">
                  <div className="stat">
                    <span className="stat-value">{campaign.sentCount}</span>
                    <span className="stat-label">Sent</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{campaign.deliveredCount}</span>
                    <span className="stat-label">Delivered</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{campaign.failedCount}</span>
                    <span className="stat-label">Failed</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{calculateDeliveryRate(campaign)}%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>

                {campaign.segmentRules && (
                  <div className="campaign-rules">
                    <h4>Audience Rules:</h4>
                    <div className="rules-summary">
                      <span className="operator-badge">
                        {campaign.segmentRules.operator}
                      </span>
                      <span className="conditions-count">
                        {campaign.segmentRules.conditions?.length || 0} conditions
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                className="btn btn-secondary"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .campaign-history {
          padding: 0;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .page-header p {
          color: #6b7280;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #6b7280;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
        }
        
        .empty-content h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .empty-content p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .campaign-card {
          padding: 1.5rem;
        }
        
        .campaign-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .campaign-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .campaign-title h3 {
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .campaign-date {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        
        .campaign-description {
          margin-bottom: 1rem;
        }
        
        .campaign-description p {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .campaign-message {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.375rem;
        }
        
        .campaign-message h4 {
          color: #1f2937;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .campaign-message p {
          color: #4b5563;
          font-style: italic;
          margin: 0;
        }
        
        .campaign-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.375rem;
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
        
        .campaign-rules h4 {
          color: #1f2937;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .rules-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .operator-badge {
          padding: 0.25rem 0.5rem;
          background-color: #e5e7eb;
          color: #374151;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .conditions-count {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .pagination-info {
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default CampaignHistory;