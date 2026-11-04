import api from './api';

export const attendanceService = {
  markAttendance: async (data) => {
    const response = await api.post('/attendance/mark', data);
    return response.data;
  },

  getEmployeeAttendance: async (employeeId) => {
    const response = await api.get(`/attendance/employee/${employeeId}`);
    return response.data;
  },

  getTodayAttendance: async (date) => {
    const response = await api.get('/attendance/today', { params: { date } });
    return response.data;
  },
};
