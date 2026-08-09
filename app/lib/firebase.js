// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPJYwrflGOsMbMioNnQXYer0rwTQAXxGQ",
  authDomain: "luckydrawtambola-bd402.firebaseapp.com",
  projectId: "luckydrawtambola-bd402",
  storageBucket: "luckydrawtambola-bd402.firebasestorage.app",
  messagingSenderId: "1052028509508",
  appId: "1:1052028509508:web:921c8dd2a54a798ce0cb11",
  measurementId: "G-LP9XCNXHJC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

