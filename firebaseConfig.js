import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyANBXlswskaQGouraZ1p8pF4uYrqjkfsms",
  authDomain: "dovizuygulama.firebaseapp.com",
  projectId: "dovizuygulama",
  storageBucket: "dovizuygulama.appspot.com",
  messagingSenderId: "629754913659",
  appId: "1:629754913659:web:7bc133e9717a75fc5213de",
  measurementId: "G-W1P54Y2YL0"
};

const app = initializeApp(firebaseConfig);
export default app;