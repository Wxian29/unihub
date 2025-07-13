import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, deletePost } from '../features/posts/postsSlice';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPost, loading, error, deleting } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchPost(id));
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(id)).unwrap();
      navigate('/posts');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = () => {
    return user && currentPost && currentPost.author === user.id;
  };

  if (loading) {
    return <div className="post-detail-page"><div className="container"><div className="loading">Loading...</div></div></div>;
  }

  if (error) {
    return <div className="post-detail-page"><div className="container"><div className="error-message">{error}</div></div></div>;
  }

  if (!currentPost) {
    return <div className="post-detail-page"><div className="container"><div className="error-message">Post does not exist</div></div></div>;
  }

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="post-detail">
          <div className="post-header">
            <div className="post-author">
              <span className="author-name">{currentPost.author_name}</span>
              {currentPost.community_name && (
                <span className="community-tag">@{currentPost.community_name}</span>
              )}
            </div>
            <span className="post-time">{formatDate(currentPost.created_at)}</span>
          </div>

          <div className="post-content">
            <p>{currentPost.content}</p>
            {currentPost.image && (
              <div className="post-image">
                <img src={currentPost.image} alt="Post image" />
              </div>
            )}
          </div>

          <div className="post-actions">
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/posts')}
            >
              Back to List
            </button>
            
            {isAuthor() && (
              <>
                <button 
                  className="btn btn-outline"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="delete-confirm">
              <div className="confirm-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="confirm-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage; 