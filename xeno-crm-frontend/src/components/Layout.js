import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';

const Layout = ({ user, onUserUpdate, children }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Generate avatar background color
  const getAvatarColor = (user) => {
    if (user?.email) {
      const colors = ['#4f46e5', '#059669', '#dc2626', '#7c2d12', '#1e40af', '#be123c'];
      const index = user.email.charCodeAt(0) % colors.length;
      return colors[index];
    }
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
            <div className="user-info">
              <div className="user-avatar">
                <div 
                  className="avatar"
                  style={{
                    backgroundColor: getAvatarColor(user)
                  }}
                >
                  {getUserInitials(user)}
                </div>
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="app-body">
        <aside className="sidebar">
          <nav>
            <Link to="/" className={isActive('/')}>
              📊 Dashboard
            </Link>
            <Link to="/customers" className={isActive('/customers')}>
              👥 Customers
            </Link>
            <Link to="/orders" className={isActive('/orders')}>
              📦 Orders
            </Link>
            <Link to="/segments/create" className={isActive('/segments/create')}>
              🎯 Create Campaign
            </Link>
            <Link to="/campaigns" className={isActive('/campaigns')}>
              📈 Campaign History
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
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          width: 100%;
        }
        
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-between {
          justify-content: space-between;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-avatar {
          display: flex;
          align-items: center;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }
        
        .user-email {
          font-size: 12px;
          color: #6b7280;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
          font-size: 14px;
        }
        
        .btn-logout {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        .btn-logout:hover {
          background-color: #e5e7eb;
          color: #1f2937;
        }
        
        .app-body {
          flex: 1;
          display: flex;
        }
        
        .sidebar {
          width: 250px;
          background-color: white;
          border-right: 1px solid #e5e7eb;
          padding: 2rem 0;
        }
        
        .sidebar nav {
          display: flex;
          flex-direction: column;
        }
        
        .nav-link {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
        }
        
        .nav-link:hover {
          background-color: #f3f4f6;
          color: #1f2937;
        }
        
        .nav-link.active {
          background-color: #4f46e5;
          color: white;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem;
          background-color: #f9fafb;
          overflow-y: auto;
        }
        
        @media (max-width: 768px) {
          .app-body {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            padding: 1rem 0;
          }
          
          .sidebar nav {
            flex-direction: row;
            overflow-x: auto;
          }
          
          .nav-link {
            white-space: nowrap;
            padding: 0.5rem 1rem;
          }
          
          .user-info {
            gap: 0.5rem;
          }
          
          .user-details {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;