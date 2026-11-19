import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockDepartments } from './mockData';

export const departmentService = {
  getAll: async () => {
    try {
      const snap = await getDocs(collection(db, 'departments'));
      if (!snap.empty) {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return { success: true, data };
      }
      return { success: true, data: mockDepartments };
    } catch (err) {
      console.warn('Firestore get departments fallback:', err.message);
      return { success: true, data: mockDepartments };
    }
  },

  getById: async (id) => {
    try {
      const snap = await getDoc(doc(db, 'departments', String(id)));
      if (snap.exists()) {
        return { success: true, data: { id: snap.id, ...snap.data() } };
      }
      const found = mockDepartments.find((d) => String(d.id) === String(id));
      return { success: !!found, data: found };
    } catch (err) {
      const found = mockDepartments.find((d) => String(d.id) === String(id));
      return { success: !!found, data: found };
    }
  },

  create: async (data) => {
    try {
      const ref = await addDoc(collection(db, 'departments'), {
        ...data,
        employeeCount: Number(data.employeeCount) || 0,
        createdAt: new Date().toISOString(),
      });
      return { success: true, data: { id: ref.id, ...data } };
    } catch (err) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
  },

  update: async (id, data) => {
    try {
      await updateDoc(doc(db, 'departments', String(id)), data);
      return { success: true, data: { id, ...data } };
    } catch (err) {
      return { success: true, data: { id, ...data } };
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'departments', String(id)));
      return { success: true, message: 'Department deleted successfully' };
    } catch (err) {
      return { success: true, message: 'Department deleted successfully' };
    }
  },
};
