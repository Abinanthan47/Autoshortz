import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4iOeC2KZYUyqVl3XdkU_CQmocoNO3AuE",
  authDomain: "ai-shortz-b29d7.firebaseapp.com",
  projectId: "ai-shortz-b29d7",
  storageBucket: "ai-shortz-b29d7.firebasestorage.app",
  messagingSenderId: "677446789780",
  appId: "1:677446789780:web:526d6dfa28ff99d2eee281",
  measurementId: "G-2C5LLNL6V4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
