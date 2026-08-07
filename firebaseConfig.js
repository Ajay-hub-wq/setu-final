
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBPcRhvFp0Z3xoXM1CtPDsC3cGz-dS2R94",
  authDomain: "setu-ultimate.firebaseapp.com",
  projectId: "setu-ultimate",
  storageBucket: "setu-ultimate.firebasestorage.app",
  messagingSenderId: "965507594614",
  appId: "1:965507594614:web:706d9ecd07db9f636ee257",
  measurementId: "G-E96820NHHP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
