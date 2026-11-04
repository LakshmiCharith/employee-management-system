import api from './api';

export const leaveService = {
  applyLeave: async (data) => {
    const response = await api.post('/leave', data);
    return response.data;
  },

  updateStatus: async (id, status, rejectionReason, approverId) => {
    const response = await api.patch(`/leave/${id}/status`, null, {
      params: { status, rejectionReason, approverId },
    });
    return response.data;
  },

  getEmployeeLeaves: async (employeeId) => {
    const response = await api.get(`/leave/employee/${employeeId}`);
    return response.data;
  },

  getAllLeaves: async () => {
    const response = await api.get('/leave');
    return response.data;
  },

  getLeaveBalance: async (employeeId) => {
    const response = await api.get(`/leave/balance/${employeeId}`);
    return response.data;
  },
};
