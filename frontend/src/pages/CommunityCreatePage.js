import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags } from '../features/community/communitySlice';
import './CommunityCreatePage.css';

const CommunityCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.community);
  const tagList = Array.isArray(tags) ? tags : [];
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
    max_members: 100,
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setFormData(prev => ({
      ...prev,
      tags: options.map(opt => Number(opt.value))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = { ...formData };
      // tags字段为id数组
      await api.post('/communities/', submitData);
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

            <div className="form-group">
              <label htmlFor="tags">Interest Tags</label>
              <select
                id="tags"
                name="tags"
                multiple
                value={formData.tags}
                onChange={handleTagsChange}
                disabled={loading}
              >
                {tagList.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <div className="hint">Hold Ctrl (Windows) or Command (Mac) to select multiple tags</div>
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