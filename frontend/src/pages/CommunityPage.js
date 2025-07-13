import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities, clearError } from '../features/community/communitySlice';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { communities, loading, error } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCommunities({ search: searchTerm }));
    
    // Clear error state when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, searchTerm]);

  // Determine whether the current user is a community administrator
  const isAdmin = (community) => {
    if (!user) return false;
    return community.current_user_role === 'admin' || 
           community.current_user_role === 'community_leader' || 
           user.is_superuser;
  };

  // Filter community list
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-page">
      <div className="container">
        <div className="page-header">
          <h1>Community List</h1>
          {user && (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/communities/create')}
            >
              Create a community
            </button>
          )}
        </div>
        
        <div className="search-section">
          <input
            type="text"
            placeholder="Search Community..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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