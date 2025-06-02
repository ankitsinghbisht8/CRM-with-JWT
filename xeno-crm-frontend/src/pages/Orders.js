import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    products: [{ name: '', price: '', quantity: 1 }],
    status: 'pending'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [pagination.currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/orders?page=${pagination.currentPage}&limit=10`);
      
      setOrders(response.data.orders);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers?limit=100');
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { name: '', price: '', quantity: 1 }]
    });
  };

  const handleRemoveProduct = (index) => {
    if (newOrder.products.length > 1) {
      const products = newOrder.products.filter((_, i) => i !== index);
      setNewOrder({ ...newOrder, products });
    }
  };

  const handleProductChange = (index, field, value) => {
    const products = [...newOrder.products];
    products[index] = { ...products[index], [field]: value };
    setNewOrder({ ...newOrder, products });
  };

  const calculateTotal = () => {
    return newOrder.products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) || 0) * (parseInt(product.quantity) || 0);
    }, 0);
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    
    if (!newOrder.customer || newOrder.products.some(p => !p.name || !p.price)) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        ...newOrder,
        products: newOrder.products.map(p => ({
          ...p,
          price: parseFloat(p.price),
          quantity: parseInt(p.quantity)
        })),
        totalAmount: calculateTotal()
      };
      
      await api.post('/api/orders', orderData);
      
      // Reset form
      setNewOrder({
        customer: '',
        products: [{ name: '', price: '', quantity: 1 }],
        status: 'pending'
      });
      setShowAddForm(false);
      
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Error adding order');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="loading-container">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders and transactions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Order'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="card add-order-form">
          <h2>Add New Order</h2>
          <form onSubmit={handleAddOrder}>
            <div className="form-group">
              <label>Customer *</label>
              <select
                className="form-control"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.firstName} {customer.lastName} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="products-section">
              <h3>Products</h3>
              {newOrder.products.map((product, index) => (
                <div key={index} className="product-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  {newOrder.products.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary remove-btn"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="total">
                <strong>Total: ${calculateTotal().toFixed(2)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Order'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="orders-table card">
        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Add your first order to get started</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h2>Order List ({pagination.total} total)</h2>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <div className="order-id">
                          #{order._id.slice(-6)}
                        </div>
                      </td>
                      <td>
                        {order.customer ? (
                          <div className="customer-info">
                            <div className="customer-name">
                              {order.customer.firstName} {order.customer.lastName}
                            </div>
                            <div className="customer-email">
                              {order.customer.email}
                            </div>
                          </div>
                        ) : (
                          'Unknown Customer'
                        )}
                      </td>
                      <td>
                        <div className="products-list">
                          {order.products.map((product, index) => (
                            <div key={index} className="product-item">
                              {product.name} (x{product.quantity})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="amount">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.orderDate)}</td>
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
        .orders {
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
        
        .add-order-form {
          margin-bottom: 2rem;
        }
        
        .add-order-form h2 {
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        
        .products-section {
          margin: 2rem 0;
        }
        
        .products-section h3 {
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .product-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 1rem;
          align-items: end;
          margin-bottom: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .remove-btn {
          height: fit-content;
        }
        
        .order-summary {
          margin: 2rem 0;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.375rem;
        }
        
        .order-summary h3 {
          margin-bottom: 0.5rem;
          color: #1f2937;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .total {
          font-size: 1.25rem;
          color: #1f2937;
        }
        
        .form-actions {
          margin-top: 1rem;
        }
        
        .orders-table {
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
        
        .order-id {
          font-family: monospace;
          font-weight: 600;
          color: #1f2937;
        }
        
        .customer-info {
          display: flex;
          flex-direction: column;
        }
        
        .customer-name {
          font-weight: 500;
          color: #1f2937;
        }
        
        .customer-email {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .products-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .product-item {
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .amount {
          font-weight: 600;
          color: #1f2937;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
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

export default Orders;