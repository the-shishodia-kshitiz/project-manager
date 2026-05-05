import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  }
};
