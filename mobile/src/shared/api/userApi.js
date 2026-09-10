import { apiClient } from './apiClient';

export const createParentAPI = async (parentData) => {
  return apiClient('/users/parents', {
    method: 'POST',
    body: parentData,
  });
};
