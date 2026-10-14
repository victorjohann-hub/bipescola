import { apiClient } from './apiClient';

export const createParentAPI = async (parentData) => {
  return apiClient('/parents', {
    method: 'POST',
    body: parentData,
  });
};

export const createUserAPI = async (userData) => {
  return apiClient('/users', {
    method: 'POST',
    body: userData,
  });
};

export const createProfessorAPI = async (professorData) => {
  return apiClient('/professors', {
    method: 'POST',
    body: professorData,
  });
};

export const loginUserAPI = async (credentials) => {
  return apiClient('/users/login', {
    method: 'POST',
    body: credentials,
  });
};

export const changePasswordAPI = async ({ senhaAtual, novaSenha }) => {
  return apiClient('/users/change-password', {
    method: 'PUT',
    body: { senhaAtual, novaSenha },
  });
};

export const forgotPasswordAPI = async ({ email }) => {
  return apiClient('/users/forgot-password', {
    method: 'POST',
    body: { email },
  });
};

export const resetPasswordAPI = async ({ email, token, novaSenha }) => {
  return apiClient('/users/reset-password', {
    method: 'POST',
    body: { email, token, novaSenha },
  });
};

export const updateUserPhotoAPI = async (userId, foto) => {
  return apiClient(`/users/${userId}/photo`, {
    method: 'PUT',
    body: { foto },
  });
};
