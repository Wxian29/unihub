import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './CommunityCreatePage.css';

const CommunityCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
    max_members: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/communities/', formData);
      navigate('/communities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community-create-page">
      <div className="container">
        <div className="create-form">
          <h1>Create a new community</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Community Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Please enter a community name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Community Introduction *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Please describe your community..."
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max_members">Maximum number of members</label>
              <input
                type="number"
                id="max_members"
                name="max_members"
                value={formData.max_members}
                onChange={handleChange}
                min="1"
                max="1000"
                disabled={loading}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  disabled={loading}
                />
                Public communities-anyone can view and join
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create a community'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate('/communities')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreatePage; 