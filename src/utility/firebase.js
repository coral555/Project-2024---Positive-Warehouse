import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// import {getFirestore} from '@firebase/firestore'
//must not be published use a dotenv file (file.env)
const firebaseConfig = {
  apiKey: "AIzaSyCz-xi7b0ANJipZ7qBrnWcSHfAGvTWBc0Q",
  authDomain: "postivestorage-fdfff.firebaseapp.com",
  projectId: "postivestorage-fdfff",
  storageBucket: "postivestorage-fdfff.appspot.com",
  messagingSenderId: "90542619965",
  appId: "1:90542619965:web:a7b1d447ac0a85270c1954",
  measurementId: "G-SLWPP5809S"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

