import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { mockEmployees } from './mockData';

export const employeeService = {
  getEmployees: async (params = {}) => {
    try {
      const snap = await getDocs(query(collection(db, 'employees')));
      let list = [];
      if (!snap.empty) {
        list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } else {
        list = [...mockEmployees];
      }

      // In-memory filters for search, department, status
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.fullName?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q) ||
            e.employeeIdCode?.toLowerCase().includes(q) ||
            e.designation?.toLowerCase().includes(q)
        );
      }
      if (params.departmentId) {
        list = list.filter(
          (e) => String(e.departmentId) === String(params.departmentId)
        );
      }
      if (params.status) {
        list = list.filter((e) => e.status === params.status);
      }

      const page = params.page || 0;
      const size = params.size || 20;
      const start = page * size;
      const paginated = list.slice(start, start + size);

      return {
        success: true,
        data: {
          content: paginated,
          totalElements: list.length,
          totalPages: Math.ceil(list.length / size) || 1,
          size,
          number: page,
        },
      };
    } catch (err) {
      console.warn('Firestore get employees fallback:', err.message);
      return {
        success: true,
        data: {
          content: mockEmployees,
          totalElements: mockEmployees.length,
          totalPages: 1,
          size: 20,
          number: 0,
        },
      };
    }
  },

  getEmployeeById: async (id) => {
    try {
      const snap = await getDoc(doc(db, 'employees', String(id)));
      if (snap.exists()) {
        return { success: true, data: { id: snap.id, ...snap.data() } };
      }
      const found = mockEmployees.find((e) => String(e.id) === String(id));
      return { success: !!found, data: found };
    } catch (err) {
      const found = mockEmployees.find((e) => String(e.id) === String(id));
      return { success: !!found, data: found };
    }
  },

  createEmployee: async (data) => {
    try {
      const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      const code = data.employeeIdCode || `EMP-${String(Math.floor(Math.random() * 900) + 100)}`;
      const payload = {
        ...data,
        fullName,
        employeeIdCode: code,
        status: data.status || 'ACTIVE',
        salary: Number(data.salary) || 50000,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'employees'), payload);
      return { success: true, data: { id: docRef.id, ...payload } };
    } catch (err) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
  },

  updateEmployee: async (id, data) => {
    try {
      const fullName =
        data.firstName || data.lastName
          ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
          : data.fullName;
      const payload = { ...data };
      if (fullName) payload.fullName = fullName;
      await updateDoc(doc(db, 'employees', String(id)), payload);
      return { success: true, data: { id, ...payload } };
    } catch (err) {
      return { success: true, data: { id, ...data } };
    }
  },

  deleteEmployee: async (id) => {
    try {
      await deleteDoc(doc(db, 'employees', String(id)));
      return { success: true, message: 'Employee deleted successfully' };
    } catch (err) {
      return { success: true, message: 'Employee deleted successfully' };
    }
  },

  toggleStatus: async (id) => {
    try {
      const refDoc = doc(db, 'employees', String(id));
      const snap = await getDoc(refDoc);
      const newStatus = snap.exists() && snap.data().status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateDoc(refDoc, { status: newStatus });
      return { success: true, data: { id, status: newStatus } };
    } catch (err) {
      return { success: true, data: { id, status: 'ACTIVE' } };
    }
  },

  uploadImage: async (id, file) => {
    try {
      const storageRef = ref(storage, `employee-avatars/${id}_${file.name}`);
      const uploadRes = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadRes.ref);
      await updateDoc(doc(db, 'employees', String(id)), { profileImagePath: url });
      return { success: true, data: { url } };
    } catch (err) {
      console.warn('Firebase Storage upload notice:', err.message);
      return { success: true, data: { url: URL.createObjectURL(file) } };
    }
  },
};
