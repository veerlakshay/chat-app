// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk_uIH2145vgIu-fA8gINxc3UY5w6xdVI",
  authDomain: "cloud-storage-app-5670c.firebaseapp.com",
  databaseURL: "https://cloud-storage-app-5670c-default-rtdb.firebaseio.com",
  projectId: "cloud-storage-app-5670c",
  storageBucket: "cloud-storage-app-5670c.firebasestorage.app",
  messagingSenderId: "311879602346",
  appId: "1:311879602346:web:23552bce9c89b8025f00d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };