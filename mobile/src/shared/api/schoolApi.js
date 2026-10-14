import { apiClient } from './apiClient';

export const listPostsAPI = async () => apiClient('/posts', { method: 'GET' });
export const createPostAPI = async (postData) => apiClient('/posts', { method: 'POST', body: postData });
export const getPostAPI = async (id) => apiClient(`/posts/${id}`, { method: 'GET' });
export const updatePostAPI = async (id, postData) => apiClient(`/posts/${id}`, { method: 'PUT', body: postData });
export const deletePostAPI = async (id) => apiClient(`/posts/${id}`, { method: 'DELETE' });

export const markAttendanceAPI = async (attendanceData) => apiClient('/attendances', { method: 'POST', body: attendanceData });
export const listAttendanceByStudentAPI = async (studentId) => apiClient(`/attendances/aluno/${studentId}`, { method: 'GET' });
export const listAttendanceByDateAPI = async (date) => apiClient(`/attendances/data/${date}`, { method: 'GET' });
export const getAttendanceHistoryAPI = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.data) queryParams.append('data', filters.data);
  if (filters.data_inicio) queryParams.append('data_inicio', filters.data_inicio);
  if (filters.data_fim) queryParams.append('data_fim', filters.data_fim);
  if (filters.aluno_id) queryParams.append('aluno_id', filters.aluno_id);
  if (filters.turma_id) queryParams.append('turma_id', filters.turma_id);
  if (filters.presente !== undefined && filters.presente !== null && filters.presente !== '') {
    queryParams.append('presente', filters.presente);
  }

  const qs = queryParams.toString();
  return apiClient(qs ? `/attendances/historico?${qs}` : '/attendances/historico', { method: 'GET' });
};

