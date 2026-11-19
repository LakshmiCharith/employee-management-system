import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockPayrolls } from './mockData';

export const payrollService = {
  generate: async (data) => {
    try {
      const basic = Number(data.basicSalary) || 10000;
      const bonuses = Number(data.bonuses) || 0;
      const deductions = Number(data.deductions) || 0;
      const netSalary = basic + bonuses - deductions;

      const payload = {
        ...data,
        basicSalary: basic,
        bonuses,
        deductions,
        netSalary,
        paymentStatus: data.paymentStatus || 'PAID',
        paymentDate: data.paymentDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'payrolls'), payload);
      return { success: true, data: { id: docRef.id, ...payload } };
    } catch (err) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
  },

  getEmployeePayrolls: async (employeeId) => {
    try {
      const q = query(
        collection(db, 'payrolls'),
        where('employeeId', '==', Number(employeeId) || employeeId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: true, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }
      return { success: true, data: mockPayrolls };
    } catch (err) {
      return { success: true, data: mockPayrolls };
    }
  },

  getById: async (id) => {
    try {
      const snap = await getDoc(doc(db, 'payrolls', String(id)));
      if (snap.exists()) {
        return { success: true, data: { id: snap.id, ...snap.data() } };
      }
      const found = mockPayrolls.find((p) => String(p.id) === String(id));
      return { success: !!found, data: found };
    } catch (err) {
      const found = mockPayrolls.find((p) => String(p.id) === String(id));
      return { success: !!found, data: found };
    }
  },

  getAll: async (payPeriod = null) => {
    try {
      const snap = await getDocs(collection(db, 'payrolls'));
      if (!snap.empty) {
        let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (payPeriod) {
          list = list.filter((p) => p.payPeriod === payPeriod);
        }
        return { success: true, data: list };
      }
      return { success: true, data: mockPayrolls };
    } catch (err) {
      return { success: true, data: mockPayrolls };
    }
  },
};
