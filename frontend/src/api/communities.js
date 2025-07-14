import api from './index';

/**
 * Fetch all communities with optional filters
 * @param {object} params
 * @returns {Promise<any>}
 */
export const fetchCommunities = (params = {}) => {
  return api.get('/communities/', { params }).then(res => res.data);
};

/**
 * Fetch a single community by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const fetchCommunity = (id) => {
  return api.get(`/communities/${id}/`).then(res => res.data);
};

/**
 * Create a new community
 * @param {object} data
 * @returns {Promise<any>}
 */
export const createCommunity = (data) => {
  return api.post('/communities/', data).then(res => res.data);
};

/**
 * Join a community
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const joinCommunity = (id) => {
  return api.post(`/communities/${id}/join/`).then(res => res.data);
};

/**
 * Leave a community
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const leaveCommunity = (id) => {
  return api.post(`/communities/${id}/leave/`).then(res => res.data);
};

/**
 * Fetch community members
 * @param {number|string} communityId
 * @returns {Promise<any>}
 */
export const fetchCommunityMembers = (communityId) => {
  return api.get(`/communities/${communityId}/members/`).then(res => res.data);
};

/**
 * Update community member (role, etc.)
 * @param {number|string} communityId
 * @param {number|string} memberId
 * @param {object} data
 * @returns {Promise<any>}
 */
export const updateCommunityMember = (communityId, memberId, data) => {
  return api.patch(`/communities/${communityId}/members/${memberId}/`, data).then(res => res.data);
};

/**
 * Remove a community member
 * @param {number|string} communityId
 * @param {number|string} memberId
 * @returns {Promise<any>}
 */
export const removeCommunityMember = (communityId, memberId) => {
  return api.delete(`/communities/${communityId}/members/${memberId}/`).then(res => res.data);
}; 