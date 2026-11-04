import api from './api';

export const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await api.post('/auth/login', { usernameOrEmail, password });
    return response.data;
  },

  signup: async (signupData) => {
    const response = await api.post('/auth/signup', signupData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, token, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, token, newPassword });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
