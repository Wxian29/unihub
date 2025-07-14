import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent, clearError, clearSuccessMessage } from '../features/event/eventSlice';
import { fetchUserCommunities } from '../features/community/communitySlice';
import './EventCreatePage.css';

const EventCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.event);
  const { userCommunities } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    community: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: '',
    cover_image: null
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchUserCommunities());
    
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        navigate('/events');
      }, 1500);
    }
  }, [successMessage, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter the event title';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter the event description';
    }

    if (!formData.community) {
      newErrors.community = 'Please select a community';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Please select the start time';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Please select the end time';
    }

    if (formData.start_time && formData.end_time) {
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      if (startTime >= endTime) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the event location';
    }

    if (formData.max_participants && parseInt(formData.max_participants) <= 0) {
      newErrors.max_participants = 'Max participants must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear the error for the corresponding field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          cover_image: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          cover_image: 'Image size must not exceed 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        cover_image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.cover_image) {
        setErrors(prev => ({
          ...prev,
          cover_image: ''
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    dispatch(createEvent(submitData));
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (!user) {
    return (
      <div className="event-create-page">
        <div className="container">
          <div className="error-message">Please log in before creating an event</div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-create-page">
      <div className="container">
        {error && (
          <div className="alert alert-danger" onClick={() => dispatch(clearError())}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        <div className="create-header">
          <h1>Create New Event</h1>
          <p>Fill in the information below to create your event</p>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? 'error' : ''}
              placeholder="Please describe the event details, process, etc."
              rows="6"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="community">Community *</label>
              <select
                id="community"
                name="community"
                value={formData.community}
                onChange={handleInputChange}
                className={errors.community ? 'error' : ''}
              >
                <option value="">Select a community</option>
                {userCommunities.map(community => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
              {errors.community && <span className="error-message">{errors.community}</span>}
              {userCommunities.length === 0 && (
                <div className="info-message">
                  You need to join a community before creating an event. 
                  <a href="/communities" className="link">Browse communities</a>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'error' : ''}
                placeholder="Enter event location"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className={errors.start_time ? 'error' : ''}
              />
              {errors.start_time && <span className="error-message">{errors.start_time}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className={errors.end_time ? 'error' : ''}
              />
              {errors.end_time && <span className="error-message">{errors.end_time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="max_participants">Max Participants</label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleInputChange}
              className={errors.max_participants ? 'error' : ''}
              placeholder="Leave blank for unlimited"
              min="1"
            />
            {errors.max_participants && <span className="error-message">{errors.max_participants}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cover_image">Cover Image</label>
            <input
              type="file"
              id="cover_image"
              name="cover_image"
              onChange={handleImageChange}
              accept="image/*"
              className={errors.cover_image ? 'error' : ''}
            />
            {errors.cover_image && <span className="error-message">{errors.cover_image}</span>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, cover_image: null }));
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreatePage; 