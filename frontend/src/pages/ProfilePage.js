import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile, updateUserProfile } from '../features/auth/authSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated, error } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    major: '',
    student_id: ''
  });

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        major: user.major || '',
        student_id: user.student_id || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        major: user.major || '',
        student_id: user.student_id || ''
      });
    }
  };

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
        <div className="profile-header">
          <h1>Profile</h1>
          {user && (
            <button
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {user ? (
          <div className="profile-content">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-section">
                  <h2>Basic Information</h2>
                  <div className="form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>First Name:</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Major:</label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Student ID:</label>
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
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
              </>
            )}
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