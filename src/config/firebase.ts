import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Demo configuration - replace with your actual Firebase config
  apiKey: "demo-api-key",
  authDomain: "safestreets-demo.firebaseapp.com",
  projectId: "safestreets-demo",
  storageBucket: "safestreets-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;