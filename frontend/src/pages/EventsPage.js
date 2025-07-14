import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, clearError } from '../features/event/eventSlice';
import './EventsPage.css';
import { joinEvent, updateEventStatus } from '../api/event';
import useApi from '../hooks/useApi';

const EventsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    my_events: false,
    my_participations: false
  });

  // Add hooks for join and status update
  const {
    loading: joining,
    error: joinError,
    request: handleJoinEvent
  } = useApi(joinEvent);

  const {
    loading: updatingStatus,
    error: statusError,
    request: handleUpdateStatus
  } = useApi(updateEventStatus);

  useEffect(() => {
    dispatch(fetchEvents(filters));
    
    // Clear error state when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
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

  // Example: join event handler
  const onJoinEvent = async (eventId) => {
    try {
      await handleJoinEvent(eventId);
      dispatch(fetchEvents(filters)); // Refresh event list
    } catch (e) {
      // Error handled by useApi
    }
  };

  // Example: update event status handler
  const onUpdateStatus = async (eventId, newStatus) => {
    try {
      await handleUpdateStatus(eventId, newStatus);
      dispatch(fetchEvents(filters)); // Refresh event list
    } catch (e) {
      // Error handled by useApi
    }
  };

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <div className="header-left">
            <h1>Event List</h1>
            <p>Discover and join a variety of exciting events</p>
          </div>
          {user && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/events/create')}
            >
              Create Event
            </button>
          )}
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="filter-options">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {user && (
              <>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.my_events}
                    onChange={(e) => handleFilterChange('my_events', e.target.checked)}
                  />
                  My Events
                </label>

                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.my_participations}
                    onChange={(e) => handleFilterChange('my_participations', e.target.checked)}
                  />
                  My Participations
                </label>
              </>
            )}
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {joining && <div className="loading">Joining event...</div>}
        {joinError && <div className="error-message">{joinError}</div>}
        {updatingStatus && <div className="loading">Updating status...</div>}
        {statusError && <div className="error-message">{statusError}</div>}
        
        <div className="event-list">
          {events.length === 0 && !loading && (
            <div className="empty-state">
              <p>No events available</p>
              {user && (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/events/create')}
                >
                  Create the first event
                </button>
              )}
            </div>
          )}
          
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-cover">
                {event.cover_image ? (
                  <img src={event.cover_image} alt={event.title} />
                ) : (
                  <div className="no-image">No image</div>
                )}
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {getStatusText(event.status)}
                </span>
              </div>

              <div className="event-content">
                <div className="event-header">
                  <h3 
                    className="event-title"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    {event.title}
                  </h3>
                  <div className="event-meta">
                    <span className="event-time">
                      {formatDateTime(event.start_time)}
                    </span>
                    <span className="event-location">
                      📍 {event.location}
                    </span>
                  </div>
                </div>

                <div className="event-info">
                  <div className="info-row">
                    <span className="community-name">
                      🏘️ {event.community_name}
                    </span>
                    <span className="participants">
                      👥 {event.current_participants}
                      {event.max_participants && ` / ${event.max_participants}`}
                    </span>
                  </div>
                  
                  <div className="creator-info">
                    <span>Creator: {event.creator_name}</span>
                  </div>
                </div>

                <div className="event-description">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...`
                    : event.description
                  }
                </div>

                <div className="event-actions">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </button>
                  
                  {user && event.creator === user.id && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 