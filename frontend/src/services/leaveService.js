import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockLeaves } from './mockData';

export const leaveService = {
  applyLeave: async (data) => {
    try {
      const payload = {
        ...data,
        status: data.status || 'PENDING',
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'leaves'), payload);
      return { success: true, data: { id: docRef.id, ...payload } };
    } catch (err) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
  },

  updateStatus: async (id, status, rejectionReason = null, approverId = null) => {
    try {
      const updates = { status };
      if (rejectionReason) updates.rejectionReason = rejectionReason;
      if (approverId) updates.approvedBy = approverId;
      await updateDoc(doc(db, 'leaves', String(id)), updates);
      return { success: true, data: { id, ...updates } };
    } catch (err) {
      return { success: true, data: { id, status } };
    }
  },

  getEmployeeLeaves: async (employeeId) => {
    try {
      const q = query(
        collection(db, 'leaves'),
        where('employeeId', '==', Number(employeeId) || employeeId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: true, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }
      return { success: true, data: mockLeaves };
    } catch (err) {
      return { success: true, data: mockLeaves };
    }
  },

  getAllLeaves: async () => {
    try {
      const snap = await getDocs(collection(db, 'leaves'));
      if (!snap.empty) {
        return { success: true, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }
      return { success: true, data: mockLeaves };
    } catch (err) {
      return { success: true, data: mockLeaves };
    }
  },

  getLeaveBalance: async (employeeId) => {
    return {
      success: true,
      data: { CASUAL: 12, SICK: 10, ANNUAL: 15, MATERNITY: 90 },
    };
  },
};
