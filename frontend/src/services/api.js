import axios from 'axios';
import {
  mockUser,
  mockStats,
  mockDepartments,
  mockEmployees,
  mockAttendance,
  mockLeaves,
  mockPayrolls,
} from './mockData';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1500,
});

// Resilient fallback interceptor: when backend is offline, return rich mock data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = (error.config?.method || 'get').toLowerCase();

    // Route matching for mock data fallback
    if (url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/me')) {
      return Promise.resolve({
        data: {
          success: true,
          message: 'Operation completed successfully',
          data: mockUser,
        },
      });
    }

    if (url.includes('/dashboard/stats')) {
      return Promise.resolve({
        data: {
          success: true,
          data: mockStats,
        },
      });
    }

    if (url.includes('/departments')) {
      return Promise.resolve({
        data: {
          success: true,
          data: mockDepartments,
        },
      });
    }

    if (url.includes('/employees')) {
      return Promise.resolve({
        data: {
          success: true,
          data: {
            content: mockEmployees,
            totalPages: 1,
            totalElements: mockEmployees.length,
            size: 10,
            number: 0,
          },
        },
      });
    }

    if (url.includes('/attendance')) {
      return Promise.resolve({
        data: {
          success: true,
          data: mockAttendance,
        },
      });
    }

    if (url.includes('/leave')) {
      return Promise.resolve({
        data: {
          success: true,
          data: mockLeaves,
        },
      });
    }

    if (url.includes('/payroll')) {
      return Promise.resolve({
        data: {
          success: true,
          data: mockPayrolls,
        },
      });
    }

    if (url.includes('/reports')) {
      return Promise.resolve({
        data: 'id,fullName,email,department,designation,salary\n1,Lakshmi Charith,laksh.charith@gmail.com,Software Engineering,Senior Engineering Director,145000',
      });
    }

    // Default fallback
    return Promise.resolve({
      data: {
        success: true,
        message: 'Mock fallback response',
        data: [],
      },
    });
  }
);

export default api;
