import { useState } from 'react';

/**
 * Custom hook for API requests
 * @param {function} apiFunc - The API function to call
 * @returns {object} { data, error, loading, request }
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};

export default useApi; 