import api from './index';

/**
 * Fetch all posts with optional filters
 * @param {object} params
 * @returns {Promise<any>}
 */
export const fetchPosts = (params = {}) => {
  return api.get('/posts/', { params }).then(res => res.data);
};

/**
 * Fetch a single post by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const fetchPost = (id) => {
  return api.get(`/posts/${id}/`).then(res => res.data);
};

/**
 * Create a new post
 * @param {object} data
 * @returns {Promise<any>}
 */
export const createPost = (data) => {
  return api.post('/posts/', data).then(res => res.data);
};

/**
 * Update a post by ID
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<any>}
 */
export const updatePost = (id, data) => {
  return api.patch(`/posts/${id}/`, data).then(res => res.data);
};

/**
 * Delete a post by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deletePost = (id) => {
  return api.delete(`/posts/${id}/`).then(res => res.data);
}; 