import api from './index';

export const registerUser = async (userData) => {
  const response = await api.post('/users/auth/register/', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/auth/login/', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/users/auth/logout/');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/users/profile/');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.patch('/users/users/profile/detail/', profileData);
  return response.data;
}; 