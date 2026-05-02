import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkC-LLCqJXnJyif2Xki2Tgf5rL2PykXTA",
  authDomain: "restaurent-management-bcc1f.firebaseapp.com",
  projectId: "restaurent-management-bcc1f",
  storageBucket: "restaurent-management-bcc1f.firebasestorage.app",
  messagingSenderId: "65863454207",
  appId: "1:65863454207:web:e8ed6e27b828f5c023abca",
  measurementId: "G-QRCEL9CB2H",
  // Adding the standard database URL for your project
  databaseURL: "https://restaurent-management-bcc1f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it as 'db'
export const db = getDatabase(app);

// Optional: Initialize Analytics
export const analytics = getAnalytics(app);