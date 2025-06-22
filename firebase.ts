// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyCf5ustuS4DfT_jbLbwGzx1jB0EEUjsDHQ",
  authDomain: "hasini-ai-chatbot.firebaseapp.com",
  projectId: "hasini-ai-chatbot",
  storageBucket: "hasini-ai-chatbot.firebasestorage.app",
  messagingSenderId: "467251380817",
  appId: "1:467251380817:web:1034e7f3a9aad7f2872e70",
};

const app = initializeApp(firebaseConfig);

// ✅ Export Firestore database so you can use it in route.ts
export const db = getFirestore(app);
