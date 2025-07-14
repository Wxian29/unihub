import api from '../api';

/**
 * Generic GET request
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function get(url, params = {}) {
  return api.get(url, { params }).then(res => res.data);
}

/**
 * Generic POST request
 * @param {string} url
 * @param {object} data
 * @returns {Promise<any>}
 */
export function post(url, data = {}) {
  return api.post(url, data).then(res => res.data);
}

/**
 * Generic PATCH request
 * @param {string} url
 * @param {object} data
 * @returns {Promise<any>}
 */
export function patch(url, data = {}) {
  return api.patch(url, data).then(res => res.data);
}

/**
 * Generic DELETE request
 * @param {string} url
 * @returns {Promise<any>}
 */
export function del(url) {
  return api.delete(url).then(res => res.data);
} 