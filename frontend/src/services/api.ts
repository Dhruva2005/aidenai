import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (userData: any) =>
    api.post('/auth/signup/public', userData),
};

// Travel Request API
export const travelAPI = {
  createRequest: (requestData: any) =>
    api.post('/travel', requestData),
  getMyRequests: () =>
    api.get('/travel/myrequests'),
  getAllRequests: (status?: string) =>
    api.get(`/travel/all${status ? `?status=${status}` : ''}`),
  getRequestById: (id: number) =>
    api.get(`/travel/${id}`),
  approveRequest: (id: number) =>
    api.put(`/travel/${id}/approve`),
  rejectRequest: (id: number, reason: string) =>
    api.put(`/travel/${id}/reject`, { reason }),
};

// User API
export const userAPI = {
  getCurrentUser: () =>
    api.get('/users/me'),
  getUserLeaves: (id: number) =>
    api.get(`/users/${id}/leaves`),
};

export default api;
