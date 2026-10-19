// Firebase SDK Client for Crystelle Studio
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBMNIDwwN3g-d140gDwr_JGdmRTXUuEd6c",
  authDomain: "crystelle-studio.firebaseapp.com",
  projectId: "crystelle-studio",
  storageBucket: "crystelle-studio.firebasestorage.app",
  messagingSenderId: "218341857418",
  appId: "1:218341857418:web:9fdebdc3eb77c7d916b573",
  measurementId: "G-Y8X8PMXYX5"
};

// Initialize Firebase App singleton
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth
export const auth: Auth = getAuth(app);

// Cloud Firestore Database
export const db: Firestore = getFirestore(app);

// Analytics (Client-side only)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export default app;
