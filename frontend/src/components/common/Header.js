import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import { fetchUnreadCount } from '../../features/notification/notificationSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Uni Hub
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home Page</Link>
            <Link to="/posts" className="nav-link">Post</Link>
            <Link to="/communities" className="nav-link">Community</Link>
            <Link to="/events" className="nav-link">Event</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="nav-link notification-link">
                notify
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                {user?.is_superuser && (
                  <a href="/admin" className="nav-link" target="_blank" rel="noopener noreferrer">Backstage Management</a>
                )}
                <div className="user-menu">
                  <span className="user-name">
                    {user?.first_name || user?.username || 'user'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    {loading ? 'Logging out...' : 'Sign out'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link btn btn-primary">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 