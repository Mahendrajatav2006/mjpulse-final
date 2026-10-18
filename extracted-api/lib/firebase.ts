import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzeTg2F4cHwXBWdTZ0_BlsJK9vUztR7eI",
  authDomain: "mj-pulse.firebaseapp.com",
  projectId: "mj-pulse",
  storageBucket: "mj-pulse.firebasestorage.app",
  messagingSenderId: "966271044330",
  appId: "1:966271044330:web:c22d98e2a8e32f48652593",
};

// Initialize Firebase only once
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const facebookProvider = new FacebookAuthProvider();
