import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPost, updatePost } from '../features/posts/postsSlice';
import { fetchCommunities } from '../features/community/communitySlice';
import './PostCreatePage.css';

const PostEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPost, updating, error } = useSelector((state) => state.posts);
  const { communities } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    content: '',
    community: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchPost(id));
    dispatch(fetchCommunities());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPost) {
      setFormData({
        content: currentPost.content || '',
        community: currentPost.community || '',
        image: null
      });
      setImagePreview(currentPost.image || null);
    }
  }, [currentPost]);

  if (!user) {
    return (
      <div className="post-create-page">
        <div className="container">
          <div className="error-message">Please log in before editing the post</div>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="post-create-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (currentPost.author !== user.id) {
    return (
      <div className="post-create-page">
        <div className="container">
          <div className="error-message">You do not have permission to edit this post</div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must not exceed 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormError('');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setFormError('Please enter post content');
      return;
    }
    setFormError('');
    try {
      const postData = new FormData();
      postData.append('content', formData.content);
      if (formData.community) {
        postData.append('community', formData.community);
      }
      if (formData.image) {
        postData.append('image', formData.image);
      }
      // If imagePreview is null and no new image, do not append 'image' at all
      await dispatch(updatePost({ postId: id, postData })).unwrap();
      navigate('/posts');
    } catch (err) {
      setFormError(err?.message || 'Update failed');
    }
  };

  return (
    <div className="post-create-page">
      <div className="container">
        <div className="create-form">
          <h1>Edit Post</h1>
          {error && <div className="error-message">{error}</div>}
          {formError && <div className="error-message">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Post Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Share your thoughts..."
                rows={6}
                disabled={updating}
                maxLength={1000}
              />
              <div className="char-count">
                {formData.content.length}/1000
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="community">Related Community (optional)</label>
              <select
                id="community"
                name="community"
                value={formData.community}
                onChange={handleChange}
                disabled={updating}
              >
                <option value="">Select Community</option>
                {communities.filter(c => c.current_user_role !== null).map(community => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="image">Image (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={updating}
              />
              <div className="image-hint">Supports JPG, PNG format, max 5MB</div>
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={removeImage}
                  disabled={updating}
                >
                  Remove Image
                </button>
              </div>
            )}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/posts')}
                disabled={updating}
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

export default PostEditPage; 