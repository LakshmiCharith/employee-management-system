import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import {
  mockDepartments,
  mockEmployees,
  mockAttendance,
  mockLeaves,
  mockPayrolls,
  mockUser,
} from '../services/mockData';

let seeded = false;

export async function seedInitialFirestoreData() {
  if (seeded) return;
  try {
    const deptSnap = await getDocs(collection(db, 'departments'));
    if (!deptSnap.empty) {
      seeded = true;
      return;
    }

    console.log('Seeding initial Firestore database collections...');
    const batch = writeBatch(db);

    // 1. Seed Departments
    mockDepartments.forEach((dept) => {
      const ref = doc(db, 'departments', String(dept.id));
      batch.set(ref, dept);
    });

    // 2. Seed Employees
    mockEmployees.forEach((emp) => {
      const ref = doc(db, 'employees', String(emp.id));
      batch.set(ref, emp);
    });

    // 3. Seed Attendance
    mockAttendance.forEach((att) => {
      const ref = doc(db, 'attendance', String(att.id));
      batch.set(ref, att);
    });

    // 4. Seed Leaves
    mockLeaves.forEach((leave) => {
      const ref = doc(db, 'leaves', String(leave.id));
      batch.set(ref, leave);
    });

    // 5. Seed Payrolls
    mockPayrolls.forEach((pay) => {
      const ref = doc(db, 'payrolls', String(pay.id));
      batch.set(ref, pay);
    });

    // 6. Seed Admin User
    const userRef = doc(db, 'users', 'admin');
    batch.set(userRef, mockUser);

    await batch.commit();
    seeded = true;
    console.log('Firestore collections successfully seeded!');
  } catch (err) {
    console.warn('Firestore auto-seed notice (may need Firestore rules or internet):', err.message);
  }
}
