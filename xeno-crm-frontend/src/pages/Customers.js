import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCustomers();
  }, [pagination.currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/customers?page=${pagination.currentPage}&limit=10`);
      
      setCustomers(response.data.customers);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/customers', newCustomer);
      
      // Reset form
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
      setShowAddForm(false);
      
      // Refresh customers list
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Error adding customer');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && customers.length === 0) {
    return (
      <div className="loading-container">
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customers">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="card add-customer-form">
          <h2>Add New Customer</h2>
          <form onSubmit={handleAddCustomer}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="customers-table card">
        {customers.length === 0 ? (
          <div className="empty-state">
            <h3>No customers yet</h3>
            <p>Add your first customer to get started</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h2>Customer List ({pagination.total} total)</h2>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total Spend</th>
                    <th>Visits</th>
                    <th>Inactive Days</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="customer-name">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>${customer.totalSpend.toFixed(2)}</td>
                      <td>{customer.visits}</td>
                      <td>{customer.inactiveDays}</td>
                      <td>{formatDate(customer.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>

      <style jsx>{`
        .customers {
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
        
        .add-customer-form {
          margin-bottom: 2rem;
        }
        
        .add-customer-form h2 {
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .form-actions {
          margin-top: 1rem;
        }
        
        .customers-table {
          padding: 0;
        }
        
        .table-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .customer-name {
          font-weight: 500;
          color: #1f2937;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
        }
        
        .empty-state h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: #6b7280;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .pagination-info {
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default Customers;