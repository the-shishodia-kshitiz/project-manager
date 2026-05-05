import axiosInstance from './axiosInstance';

export const projectsApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.patch(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/projects/${id}`);
  },
  getMembers: async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/members`);
    return response.data;
  },
  addMember: async (projectId, data) => {
    const response = await axiosInstance.post(`/projects/${projectId}/members`, data);
    return response.data;
  },
  removeMember: async (projectId, userId) => {
    await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  }
};
