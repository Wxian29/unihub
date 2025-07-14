import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api';
import './CommunityDetailPage.css';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/communities/${id}/`);
      setCommunity(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load community information');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    setJoining(true);
    try {
      await api.post(`/communities/${id}/join/`);
      await fetchCommunity();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join the community');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this community?')) return;
    setLeaving(true);
    try {
      await api.post(`/communities/${id}/leave/`);
      await fetchCommunity();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to exit the community');
    } finally {
      setLeaving(false);
    }
  };

  const isMember = () => {
    if (!user || !community) return false;
    return community.current_user_role !== null;
  };

  const isAdmin = () => {
    if (!user || !community) return false;
    // Global admin, community_leader or super administrator can manage
    if (user.role === 'admin' || user.role === 'community_leader' || user.is_superuser) return true;
    // Compatible with the original logic
    return community.current_user_role === 'admin' || community.current_user_role === 'community_leader';
  };

  if (loading) {
    return <div className="community-detail-page"><div className="container"><div className="loading">loading...</div></div></div>;
  }

  if (error) {
    return <div className="community-detail-page"><div className="container"><div className="error-message">{error}</div></div></div>;
  }

  if (!community) {
    return null;
  }

  return (
    <div className="community-detail-page">
      <div className="container">
        <div className="community-header">
          <div className="community-info">
            <h1>{community.name}</h1>
            <p className="community-description">{community.description}</p>
            <div className="community-stats">
              <span>Number of Members:{community.member_count}</span>
              <span>Creator:{community.creator_name}</span>
              <span>Creation time:{new Date(community.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="community-actions">
            {isMember() ? (
              <>
                {isAdmin() && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/communities/${id}/manage`)}
                  >
                    Manage Community
                  </button>
                )}
                <button 
                  className="btn btn-outline"
                  onClick={handleLeave}
                  disabled={leaving}
                >
                  {leaving ? 'Exiting...' : 'Exit the community'}
                </button>
              </>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? 'Joining...' : 'Join the community'}
              </button>
            )}
          </div>
        </div>

        <div className="community-content">
          <div className="posts-section">
            <h2>Community Posts</h2>
            {community.posts && community.posts.length > 0 ? (
              <div className="posts-list">
                {community.posts.map((post) => (
                  <div 
                    className="post-card" 
                    key={post.id} 
                    onClick={() => navigate(`/posts/${post.id}`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="post-header">
                      <div className="post-author">
                        <span className="author-name">{post.author_name}</span>
                        <span className="post-time">{new Date(post.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="post-content">{post.content}</div>
                    {post.image && (
                      <div className="post-image">
                        <img src={post.image} alt="Post Image" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <p>No post yet</p>
                {isMember() && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/communities/${id}/post`)}
                  >
                    Post
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="members-section">
            <h2>Members List</h2>
            {community.members && community.members.length > 0 ? (
              <div className="members-list">
                {community.members.slice(0, 10).map((member) => (
                  <div className="member-item" key={member.id}>
                    <span className="member-name">{member.user_name}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                ))}
                {community.members.length > 10 && (
                  <div className="more-members">
                    There are {community.members.length - 10} members left...
                  </div>
                )}
              </div>
            ) : (
              <p>No members yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage; 