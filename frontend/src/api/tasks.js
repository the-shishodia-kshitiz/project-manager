import axiosInstance from './axiosInstance';

export const tasksApi = {
  getProjectTasks: async (projectId, page = 0, size = 100) => {
    const response = await axiosInstance.get(`/projects/${projectId}/tasks`, {
      params: { page, size }
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (projectId, data) => {
    const response = await axiosInstance.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.patch(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/tasks/${id}`);
  }
};
