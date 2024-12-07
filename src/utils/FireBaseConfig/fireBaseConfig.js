// src/utils/FireBaseConfig/fireBaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARZ_AG7YUsS0fT56lfcWXc4Ns_OxG1b9w",
  authDomain: "rupex-91ec9.firebaseapp.com",
  projectId: "rupex-91ec9",
  storageBucket: "rupex-91ec9.appspot.com",
  messagingSenderId: "650771351479",
  appId: "1:650771351479:web:232759f4776049a40eca32",
  measurementId: "G-C86TDBER70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);
const storage = getStorage(app);

// Create 'db' instance directly from 'firestore'
const db = firestore;

export { app, auth, firestore, storage, db };
