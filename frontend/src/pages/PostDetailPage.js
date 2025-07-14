import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, deletePost } from '../features/posts/postsSlice';
import { fetchComments, createComment } from '../api/posts';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPost, loading, error, deleting } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch post and comments
  useEffect(() => {
    dispatch(fetchPost(id));
    loadComments();
    // eslint-disable-next-line
  }, [dispatch, id]);

  const loadComments = async () => {
    setCommentLoading(true);
    setCommentError('');
    try {
      const data = await fetchComments(id);
      console.log('comments api response:', data); // Debug: print API response
      setComments(data);
    } catch (err) {
      setCommentError('Failed to load comments');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setCommentError('');
    try {
      await createComment(id, { content: newComment });
      setNewComment('');
      await loadComments();
    } catch (err) {
      setCommentError(err?.response?.data?.detail || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

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

  // Robustly handle comments as array or paginated object
  const commentArray = Array.isArray(comments)
    ? comments
    : (comments && Array.isArray(comments.results) ? comments.results : []);

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

          {/* Comment Section */}
          <div className="comments-section">
            <h2>Comments</h2>
            {commentLoading ? (
              <div className="loading">Loading comments...</div>
            ) : commentError ? (
              <div className="error-message">{commentError}</div>
            ) : commentArray.length === 0 ? (
              <div className="no-comments">No comments yet.</div>
            ) : (
              <ul className="comments-list">
                {commentArray.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author_name}</span>
                      <span className="comment-time">{formatDate(comment.created_at)}</span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Comment Form */}
            {user ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  disabled={submitting}
                  maxLength={500}
                  required
                />
                <button className="btn btn-primary" type="submit" disabled={submitting || !newComment.trim()}>
                  {submitting ? 'Submitting...' : 'Submit Comment'}
                </button>
              </form>
            ) : (
              <div className="login-to-comment">Please log in to comment.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage; 