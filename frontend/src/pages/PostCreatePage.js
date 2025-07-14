import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost } from '../features/posts/postsSlice';
import { fetchCommunities } from '../features/community/communitySlice';
import './PostCreatePage.css';

const PostCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating, error } = useSelector((state) => state.posts);
  const { communities } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);
  
  const { id: communityIdFromUrl } = useParams();

  const [formData, setFormData] = useState({
    content: '',
    community: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  useEffect(() => {
    // If accessed from /communities/:id/post, pre-select the community
    if (communityIdFromUrl) {
      setFormData(prev => ({
        ...prev,
        community: communityIdFromUrl
      }));
    }
  }, [communityIdFromUrl]);

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must not exceed 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormError('');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
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

      await dispatch(createPost(postData)).unwrap();
      navigate('/posts');
    } catch (err) {
      setFormError(err);
    }
  };

  // Find the current community object if accessed from /communities/:id/post
  const currentCommunity = communityIdFromUrl
    ? communities.find(c => String(c.id) === String(communityIdFromUrl))
    : null;

  return (
    <div className="post-create-page">
      <div className="container">
        <div className="create-form">
          <h1>Create Post</h1>
          
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
                disabled={creating}
                maxLength={1000}
              />
              <div className="char-count">
                {formData.content.length}/1000
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="community">Post to Community {communityIdFromUrl ? '(locked)' : '(optional)'}</label>
              <select
                id="community"
                name="community"
                value={formData.community}
                onChange={handleChange}
                disabled={creating || !!communityIdFromUrl} // disable if locked
              >
                {communityIdFromUrl ? (
                  // Only show the current community as an option
                  <option value={currentCommunity?.id || ''}>
                    {currentCommunity?.name || 'Current Community'}
                  </option>
                ) : (
                  <>
                    <option value="">Select Community</option>
                    {communities.filter(c => c.current_user_role !== null).map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Add Image (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={creating}
              />
              <div className="image-hint">
                Supports JPG, PNG format, max 5MB
              </div>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={removeImage}
                  disabled={creating}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={creating}
              >
                {creating ? 'Posting...' : 'Create Post'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => navigate('/posts')}
                disabled={creating}
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

export default PostCreatePage; 