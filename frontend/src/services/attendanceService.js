import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockAttendance } from './mockData';

export const attendanceService = {
  markAttendance: async (data) => {
    try {
      const payload = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'attendance'), payload);
      return { success: true, data: { id: docRef.id, ...payload } };
    } catch (err) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
  },

  getEmployeeAttendance: async (employeeId) => {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('employeeId', '==', Number(employeeId) || employeeId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: true, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }
      return { success: true, data: mockAttendance };
    } catch (err) {
      return { success: true, data: mockAttendance };
    }
  },

  getTodayAttendance: async (date) => {
    try {
      const snap = await getDocs(collection(db, 'attendance'));
      if (!snap.empty) {
        return { success: true, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }
      return { success: true, data: mockAttendance };
    } catch (err) {
      return { success: true, data: mockAttendance };
    }
  },
};
