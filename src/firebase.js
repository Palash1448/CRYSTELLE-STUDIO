// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBMNIDwwN3g-d140gDwr_JGdmRTXUuEd6c",
  authDomain: "crystelle-studio.firebaseapp.com",
  projectId: "crystelle-studio",
  storageBucket: "crystelle-studio.firebasestorage.app",
  messagingSenderId: "218341857418",
  appId: "1:218341857418:web:9fdebdc3eb77c7d916b573",
  measurementId: "G-Y8X8PMXYX5"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth for Admin & Users
export const auth = getAuth(app);

// Cloud Firestore Database
export const db = getFirestore(app);

// Safe Analytics initialization for browser/SSR environments
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // analytics unsupported in environment
    });
}

export default app;
