import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities, clearError } from '../features/community/communitySlice';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Add import for API

const CommunityPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { communities, loading, error } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  // State for all tags
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    dispatch(fetchCommunities({ search: searchTerm }));
    // Fetch all tags once
    fetchTags();
    // Clear error state when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, searchTerm]);

  // Fetch all tags for mapping ids to names
  const fetchTags = async () => {
    try {
      const res = await api.get('/communities/tags/');
      if (Array.isArray(res.data)) {
        setAllTags(res.data);
      } else if (Array.isArray(res.data.results)) {
        setAllTags(res.data.results);
      } else {
        setAllTags([]);
      }
    } catch (err) {
      setAllTags([]);
    }
  };

  // Determine whether the current user is a community administrator
  const isAdmin = (community) => {
    if (!user) return false;
    return community.current_user_role === 'admin' || 
           community.current_user_role === 'community_leader' || 
           user.is_superuser;
  };

  // Check if user has permission to create communities
  const canCreateCommunity = () => {
    if (!user) return false;
    // Platform admins can create communities
    if (user.is_staff || user.is_superuser) return true;
    // Community leaders and admins can create communities
    if (user.role === 'community_leader' || user.role === 'admin') return true;
    return false;
  };

  // Filter community list by search term and selected tags
  const filteredCommunities = communities.filter(community => {
    const matchesText =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      (Array.isArray(community.tags) && selectedTags.every(tagId => community.tags.some(tag => (tag.id || tag) === tagId)));
    return matchesText && matchesTags;
  });

  return (
    <div className="community-page">
      <div className="container">
        <div className="page-header">
          <h1>Community List</h1>
          {user && canCreateCommunity() && (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/communities/create')}
            >
              Create a community
            </button>
          )}
        </div>
        
        <div className="search-section" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search Community..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ flex: 1, minWidth: 220 }}
          />
          {/* Tag filter beautified */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 220 }}>
            <label htmlFor="tag-select" style={{ fontWeight: 500, marginBottom: 4 }}>Filter by Tags</label>
            <select
              id="tag-select"
              multiple
              value={selectedTags}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions);
                setSelectedTags(options.map(opt => Number(opt.value)));
              }}
              className="tag-select"
              style={{ border: '1px solid #667eea', borderRadius: 6, padding: 8, background: '#f8f9fa', color: '#333', minHeight: 80 }}
            >
              {allTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            {/* Show selected tags as chips, support removal by click */}
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedTags.map(tagId => {
                const tag = allTags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tag.id}
                    style={{ background: '#667eea', color: 'white', borderRadius: 12, padding: '2px 10px', fontSize: 13, display: 'inline-block', cursor: 'pointer', userSelect: 'none', position: 'relative' }}
                    title="Remove tag"
                    onClick={() => setSelectedTags(selectedTags.filter(id => id !== tag.id))}
                  >
                    {tag.name}
                    <span style={{ marginLeft: 6, fontWeight: 'bold', fontSize: 15, color: '#fff', opacity: 0.8 }}>×</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {loading && <div className="loading">loading...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="community-list">
          {filteredCommunities.length === 0 && !loading && (
            <div className="no-results">
              {searchTerm ? 'No matching communities found' : 'No community yet'}
            </div>
          )}
          {filteredCommunities.map((community) => (
            <div className="community-card" key={community.id}>
              <div className="community-header">
                <h2>{community.name}</h2>
                <span className="community-members">Number of Members:{community.member_count}</span>
              </div>
              {/* Display tags */}
              <div className="community-tags">
                {Array.isArray(community.tags) && community.tags.length > 0 ? (
                  community.tags.map(tag => {
                    // Map tag id or object to tag name using allTags
                    const tagObj = allTags.find(t => t.id === (tag.id || tag));
                    return (
                      <span key={tag.id || tag} className="community-tag">{tagObj ? tagObj.name : (tag.name || tag)}</span>
                    );
                  })
                ) : (
                  <span className="community-tag none">No tags</span>
                )}
              </div>
              <div className="community-desc">{community.description}</div>
              <div className="community-actions">
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate(`/communities/${community.id}`)}
                >
                  check the details
                </button>
                {isAdmin(community) && (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => navigate(`/communities/${community.id}/manage`)}
                  >
                    Manage Community
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 