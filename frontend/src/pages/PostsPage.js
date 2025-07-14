import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, clearError } from '../features/posts/postsSlice';
import { fetchUserCommunities } from '../features/community/communitySlice';
import './PostsPage.css';

const PostsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userCommunities } = useSelector((state) => state.community);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, my, community

  useEffect(() => {
    // Only fetch posts list when user is authenticated
    if (isAuthenticated) {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filter === 'my') params.author_id = user?.id;
      dispatch(fetchPosts(params));
      dispatch(fetchUserCommunities()); // fetch user's joined communities
    }
    
    // Clear error state when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, searchTerm, filter, user, isAuthenticated]);

  const handleCreatePost = () => {
    navigate('/posts/create');
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Ensure posts is an array
  const postsArray = Array.isArray(posts) ? posts : [];

  // Only show posts from joined communities or global posts
  const joinedCommunityIds = Array.isArray(userCommunities)
    ? userCommunities.map(c => c.id)
    : [];
  let visiblePosts = postsArray.filter(post => {
    // Show global posts (no community) or posts from joined communities
    return !post.community || joinedCommunityIds.includes(post.community);
  });

  // If filter is 'community', only show posts from joined communities (exclude global posts)
  if (filter === 'community') {
    visiblePosts = postsArray.filter(post => post.community && joinedCommunityIds.includes(post.community));
  }

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="posts-page">
        <div className="container">
          <div className="auth-required">
            <h1>Posts Square</h1>
            <p>Please log in to view posts</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-page">
      <div className="container">
        <div className="page-header">
          <h1>Posts Square</h1>
          <button 
            className="btn btn-primary"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </div>

        <div className="posts-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Posts</option>
              <option value="my">My Posts</option>
              <option value="community">Community Posts</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="posts-list">
          {visiblePosts.length === 0 && !loading && (
            <div className="no-posts">
              <p>No posts yet</p>
              <button 
                className="btn btn-primary"
                onClick={handleCreatePost}
              >
                Create the first post
              </button>
            </div>
          )}
          
          {visiblePosts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <div className="post-author">
                  <span className="author-name">{post.author_name}</span>
                  {post.community_name && (
                    <span className="community-tag">@{post.community_name}</span>
                  )}
                </div>
                <span className="post-time">{formatDate(post.created_at)}</span>
              </div>
              
              <div className="post-content" onClick={() => handleViewPost(post.id)}>
                <p>{post.content}</p>
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="Post image" />
                  </div>
                )}
              </div>
              
              <div className="post-actions">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleViewPost(post.id)}
                >
                  View Details
                </button>
                {user && post.author === user.id && (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                  >
                    Edit
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

export default PostsPage; 