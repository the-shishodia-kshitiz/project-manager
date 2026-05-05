import axiosInstance from './axiosInstance';

export const usersApi = {
  getAll: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/users', {
      params: { page, size }
    });
    return response.data;
  },
  changeRole: async (id, role) => {
    const response = await axiosInstance.patch(`/users/${id}/role`, null, {
      params: { role }
    });
    return response.data;
  }
};
