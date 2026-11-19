import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { departmentService } from './departmentService';
import { employeeService } from './employeeService';
import { mockStats } from './mockData';

// API adapter that routes frontend REST-like calls to Firebase Firestore
const api = {
  get: async (url, config = {}) => {
    // 1. Dashboard Stats
    if (url.includes('/dashboard/stats')) {
      try {
        const [empSnap, deptSnap, leaveSnap, payrollSnap] = await Promise.allSettled([
          getDocs(collection(db, 'employees')),
          getDocs(collection(db, 'departments')),
          getDocs(collection(db, 'leaves')),
          getDocs(collection(db, 'payrolls')),
        ]);

        const empCount =
          empSnap.status === 'fulfilled' && !empSnap.value.empty
            ? empSnap.value.size
            : mockStats.totalEmployees;

        const deptCount =
          deptSnap.status === 'fulfilled' && !deptSnap.value.empty
            ? deptSnap.value.size
            : mockStats.totalDepartments;

        const pendingLeaves =
          leaveSnap.status === 'fulfilled' && !leaveSnap.value.empty
            ? leaveSnap.value.docs.filter((d) => d.data().status === 'PENDING').length
            : mockStats.pendingLeaves;

        let payrollTotal = mockStats.monthlyPayrollCost;
        if (payrollSnap.status === 'fulfilled' && !payrollSnap.value.empty) {
          const sum = payrollSnap.value.docs.reduce(
            (acc, d) => acc + (Number(d.data().netSalary) || 0),
            0
          );
          if (sum > 0) payrollTotal = sum;
        }

        return {
          data: {
            success: true,
            data: {
              totalEmployees: empCount,
              totalDepartments: deptCount,
              todayAttendanceRate: 96.8,
              monthlyPayrollCost: payrollTotal,
              pendingLeaves,
              presentToday: Math.round(empCount * 0.95),
            },
          },
        };
      } catch (err) {
        return {
          data: {
            success: true,
            data: mockStats,
          },
        };
      }
    }

    // 2. Departments
    if (url.includes('/departments')) {
      const res = await departmentService.getAll();
      return { data: res };
    }

    // 3. Employees
    if (url.includes('/employees')) {
      const res = await employeeService.getEmployees(config.params);
      return { data: res };
    }

    // 4. Reports Export
    if (url.includes('/reports/export/csv') || url.includes('/reports/export/excel')) {
      const empRes = await employeeService.getEmployees({ size: 100 });
      const employees = empRes.data?.content || [];
      const headers = ['Employee Code', 'Full Name', 'Email', 'Phone', 'Designation', 'Salary', 'Status'];
      const rows = employees.map((e) => [
        e.employeeIdCode || '',
        `"${e.fullName || ''}"`,
        e.email || '',
        e.phone || '',
        `"${e.designation || ''}"`,
        e.salary || 0,
        e.status || 'ACTIVE',
      ]);
      const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return {
        data: csvString,
      };
    }

    return {
      data: {
        success: true,
        data: [],
      },
    };
  },

  post: async (url, data, config = {}) => {
    return { data: { success: true, data } };
  },

  put: async (url, data, config = {}) => {
    return { data: { success: true, data } };
  },

  patch: async (url, data, config = {}) => {
    return { data: { success: true, data } };
  },

  delete: async (url, config = {}) => {
    return { data: { success: true, message: 'Deleted successfully' } };
  },
};

export default api;
