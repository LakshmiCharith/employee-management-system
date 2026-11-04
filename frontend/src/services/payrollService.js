import api from './api';

export const payrollService = {
  generate: async (data) => {
    const response = await api.post('/payroll/generate', data);
    return response.data;
  },

  getEmployeePayrolls: async (employeeId) => {
    const response = await api.get(`/payroll/employee/${employeeId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  getAll: async (payPeriod) => {
    const response = await api.get('/payroll', { params: { payPeriod } });
    return response.data;
  },
};
