// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDAXlAnghbyQiR54JOwue5YezsbpDh5kQk",
  authDomain: "messaging-app-440c6.firebaseapp.com",
  projectId: "messaging-app-440c6",
  storageBucket: "messaging-app-440c6.appspot.com",
  messagingSenderId: "577452184332",
  appId: "1:577452184332:web:8c138b142262e325592f29"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();