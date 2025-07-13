import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../features/auth/authSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>
        {user ? (
          <div className="profile-content">
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Username:</label>
                  <span>{user.username}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Name:</label>
                  <span>{user.first_name} {user.last_name}</span>
                </div>
                {user.major && (
                  <div className="info-item">
                    <label>Major:</label>
                    <span>{user.major}</span>
                  </div>
                )}
                {user.student_id && (
                  <div className="info-item">
                    <label>Student ID:</label>
                    <span>{user.student_id}</span>
                  </div>
                )}
                {user.bio && (
                  <div className="info-item">
                    <label>Bio:</label>
                    <span>{user.bio}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="profile-section">
              <h2>Authentication Status</h2>
              <div className="auth-status">
                <span className="status-badge success">Logged In</span>
                <p>User ID: {user.id}</p>
                {user.is_superuser && (
                  <span className="status-badge" style={{background:'#007bff',color:'#fff'}}>Superuser</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <p>Unable to fetch user information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 