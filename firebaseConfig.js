import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBLRgXwc_Fy5VT85G_Wh1_0w-a4DuMwWSU",
  authDomain: "share-4331b.firebaseapp.com",
  databaseURL: "https://share-4331b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "share-4331b",
  storageBucket: "share-4331b.appspot.com",
  messagingSenderId: "239681965521",
  appId: "1:239681965521:web:746fbca6d05b5ca189a4f0"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);
export {db,app, auth,storage};