import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  }
};
