import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchEventDetail, 
  joinEvent, 
  leaveEvent, 
  updateEventStatus,
  clearError,
  clearSuccessMessage 
} from '../features/event/eventSlice';
import EventStats from '../components/EventStats';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  const { currentEvent, detailLoading, loading, error, successMessage } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventDetail(eventId));
    }
    
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch, eventId]);

  const handleJoinEvent = () => {
    dispatch(joinEvent(eventId));
  };

  const handleLeaveEvent = () => {
    dispatch(leaveEvent(eventId));
  };

  const handleStatusUpdate = (newStatus) => {
    dispatch(updateEventStatus({ eventId, status: newStatus }));
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'published': 'Published',
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'draft': '#999',
      'published': '#28a745',
      'ongoing': '#007bff',
      'completed': '#6c757d',
      'cancelled': '#dc3545'
    };
    return colorMap[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'draft': '📝',
      'published': '📢',
      'ongoing': '🎯',
      'completed': '✅',
      'cancelled': '❌'
    };
    return iconMap[status] || '📝';
  };

  if (detailLoading) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="error-message">Event does not exist</div>
        </div>
      </div>
    );
  }

  const isCreator = user && currentEvent.creator === user.id;
  const canManage = isCreator || user?.is_staff;

  return (
    <div className="event-detail-page">
      <div className="container">
        {error && (
          <div className="alert alert-danger" onClick={() => dispatch(clearError())}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="alert alert-success" onClick={() => dispatch(clearSuccessMessage())}>
            {successMessage}
          </div>
        )}

        <div className="event-header">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="header-content">
            <h1>{currentEvent.title}</h1>
            <div className="status-info">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(currentEvent.status) }}
              >
                {getStatusIcon(currentEvent.status)} {getStatusText(currentEvent.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="event-content">
          <div className="event-main">
            {currentEvent.cover_image && (
              <div className="event-cover">
                <img src={currentEvent.cover_image} alt={currentEvent.title} />
              </div>
            )}

            <EventStats event={currentEvent} />

            <div className="event-info-grid">
              <div className="info-card">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <h4>Event Time</h4>
                  <p>{formatDateTime(currentEvent.start_time)} - {formatDateTime(currentEvent.end_time)}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>{currentEvent.location}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🏘️</div>
                <div className="info-content">
                  <h4>Community</h4>
                  <p>{currentEvent.community_name}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <h4>Creator</h4>
                  <p>{currentEvent.creator_name}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">👥</div>
                <div className="info-content">
                  <h4>Participants</h4>
                  <p>
                    {currentEvent.current_participants}
                    {currentEvent.max_participants && ` / ${currentEvent.max_participants}`}
                  </p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <h4>Created At</h4>
                  <p>{formatDateTime(currentEvent.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="event-description">
              <h3>📋 Event Description</h3>
              <div className="description-content">
                {currentEvent.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="event-actions">
              {user ? (
                currentEvent.is_participant ? (
                  <button 
                    className="btn btn-danger"
                    onClick={handleLeaveEvent}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Leave Event'}
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={handleJoinEvent}
                    disabled={loading || currentEvent.status !== 'published'}
                  >
                    {loading ? 'Processing...' : 'Join Event'}
                  </button>
                )
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Login to Join
                </button>
              )}

              {canManage && (
                <div className="admin-actions">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/events/${eventId}/edit`)}
                  >
                    Edit Event
                  </button>
                  
                  <div className="status-actions">
                    <span>Status Management: </span>
                    {currentEvent.status === 'draft' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate('published')}
                        disabled={loading}
                      >
                        Publish
                      </button>
                    )}
                    {currentEvent.status === 'published' && (
                      <>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleStatusUpdate('ongoing')}
                          disabled={loading}
                        >
                          Start
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleStatusUpdate('cancelled')}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {currentEvent.status === 'ongoing' && (
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleStatusUpdate('completed')}
                        disabled={loading}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 