import React from 'react';
import './EventStats.css';

const EventStats = ({ event }) => {
  const calculateTimeStatus = () => {
    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
    if (now < startTime) {
      return { status: 'upcoming', text: 'upcoming', color: '#ffc107' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'ongoing', text: 'ongoing', color: '#28a745' };
    } else {
      return { status: 'ended', text: 'ended', color: '#6c757d' };
    }
  };

  const calculateParticipationRate = () => {
    if (!event.max_participants) return null;
    return Math.round((event.current_participants / event.max_participants) * 100);
  };

  const timeStatus = calculateTimeStatus();
  const participationRate = calculateParticipationRate();

  return (
    <div className="event-stats">
      <h3>📊 Event Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">{timeStatus.text}</div>
            <div className="stat-label">time status</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">
              {event.current_participants}
              {event.max_participants && ` / ${event.max_participants}`}
            </div>
            <div className="stat-label">number of participants</div>
          </div>
        </div>

        {participationRate !== null && (
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{participationRate}%</div>
              <div className="stat-label">participation rate</div>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">
              {Math.ceil((new Date(event.end_time) - new Date(event.start_time)) / (1000 * 60 * 60))}小时
            </div>
            <div className="stat-label">Event duration</div>
          </div>
        </div>
      </div>

      {event.max_participants && (
        <div className="participation-progress">
          <div className="progress-label">
          Participation Progress: {event.current_participants} / {event.max_participants}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%`,
                backgroundColor: participationRate > 80 ? '#dc3545' : participationRate > 60 ? '#ffc107' : '#28a745'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStats; 