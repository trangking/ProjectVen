// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt4hJzCGHCP2Hp8lQ7Xoxexv7qauYgu-A",
  authDomain: "appointmentven.firebaseapp.com",
  projectId: "appointmentven",
  storageBucket: "appointmentven.appspot.com",
  messagingSenderId: "1084978936005",
  appId: "1:1084978936005:web:df525fd313432244a358ac",
  measurementId: "G-KGC3LCBM55",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore

export { db };
