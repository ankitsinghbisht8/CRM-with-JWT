import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';

const Layout = ({ user, children }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  // Get user initials for fallback
  const getUserInitials = (user) => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    //fallback if no username or email so this runs
    return 'U';
  };

  // Generate a simple avatar background color based on user
  const getAvatarColor = (user) => {
    if (user?.email) {
      const colors = ['#4f46e5', '#059669', '#dc2626', '#7c2d12', '#1e40af', '#be123c'];
      const index = user.email.charCodeAt(0) % colors.length;
      return colors[index];
    }
    //falback if no email available 
    return '#4f46e5';
  };
  
  return (
    <div className="app-layout">
      <header className="header">
        <div className="container flex items-center justify-between">
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 style={{ color: '#4f46e5', margin: 0 }}>Xeno CRM</h1>
            </Link>
          </div>
          
          {user && (
            <div className="user-info flex items-center gap-2">
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: getAvatarColor(user),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {getUserInitials(user)}
              </div>
              <span style={{ marginRight: '1rem' }}>{user.name || user.email}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="main-layout flex">
        <aside className="sidebar">
          <nav>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/customers" className={isActive('/customers')}>
              Customers
            </Link>
            <Link to="/orders" className={isActive('/orders')}>
              Orders
            </Link>
            <Link to="/segments/create" className={isActive('/segments/create')}>
              Create Campaign
            </Link>
            <Link to="/campaigns" className={isActive('/campaigns')}>
              Campaign History
            </Link>
          </nav>
        </aside>
        
        <main className="main-content">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
      
      <style jsx>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 0;
        }
        
        .main-layout {
          flex: 1;
        }
        
        .sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e5e7eb;
          padding: 2rem 0;
        }
        
        .nav-link {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .nav-link:hover {
          background-color: #f3f4f6;
          color: #4f46e5;
        }
        
        .nav-link.active {
          background-color: #eef2ff;
          color: #4f46e5;
          border-right: 3px solid #4f46e5;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem 0;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default Layout;