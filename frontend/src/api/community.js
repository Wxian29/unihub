import api from './index';

export const getAllTags = async () => {
  const response = await api.get('/communities/tags/');
  return response.data;
}; 