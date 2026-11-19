import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA48jb61YzKKVZhQhyWE4LaCF17DI87Tvw",
  authDomain: "employee-management-syst-76842.firebaseapp.com",
  projectId: "employee-management-syst-76842",
  storageBucket: "employee-management-syst-76842.firebasestorage.app",
  messagingSenderId: "207818045658",
  appId: "1:207818045658:web:4b4493f2def92e60ee0de3",
  measurementId: "G-X6SJS4T7K3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
