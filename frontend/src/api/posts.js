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

/**
 * Fetch comments for a post
 * @param {number|string} postId
 * @returns {Promise<any[]>}
 */
export const fetchComments = (postId) => {
  return api.get(`/posts/${postId}/comments/`).then(res => res.data);
};

/**
 * Create a comment for a post
 * @param {number|string} postId
 * @param {object} data - { content: string }
 * @returns {Promise<any>}
 */
export const createComment = (postId, data) => {
  return api.post(`/posts/${postId}/comments/`, data).then(res => res.data);
};

/**
 * Like a post
 * @param {number|string} postId
 * @returns {Promise<any>}
 */
export const likePost = (postId) => {
  return api.post(`/posts/${postId}/like/`).then(res => res.data);
};

/**
 * Unlike a post
 * @param {number|string} postId
 * @returns {Promise<any>}
 */
export const unlikePost = (postId) => {
  return api.post(`/posts/${postId}/unlike/`).then(res => res.data);
};

/**
 * Fetch likes for a post
 * @param {number|string} postId
 * @returns {Promise<any[]>}
 */
export const fetchLikes = (postId) => {
  return api.get(`/posts/${postId}/likes/`).then(res => res.data);
}; 