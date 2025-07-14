import api from './index';

/**
 * Fetch all events with optional filters
 * @param {object} params
 * @returns {Promise<any>}
 */
export const fetchEvents = (params = {}) => {
  return api.get('/events/', { params }).then(res => res.data);
};

/**
 * Fetch a single event by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const fetchEvent = (id) => {
  return api.get(`/events/${id}/`).then(res => res.data);
};

/**
 * Create a new event
 * @param {object} data
 * @returns {Promise<any>}
 */
export const createEvent = (data) => {
  return api.post('/events/', data).then(res => res.data);
};

/**
 * Update an event by ID
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<any>}
 */
export const updateEvent = (id, data) => {
  return api.patch(`/events/${id}/`, data).then(res => res.data);
};

/**
 * Delete an event by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteEvent = (id) => {
  return api.delete(`/events/${id}/`).then(res => res.data);
};

/**
 * Join an event
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const joinEvent = (id) => {
  return api.post(`/events/${id}/join/`).then(res => res.data);
};

/**
 * Update event status
 * @param {number|string} id
 * @param {string} status
 * @returns {Promise<any>}
 */
export const updateEventStatus = (id, status) => {
  return api.post(`/events/${id}/status/`, { status }).then(res => res.data);
}; 