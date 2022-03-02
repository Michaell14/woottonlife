import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB11Q4Tdtmj5ywVQXq8NIfVu5Kg6IgqgZ8",
    authDomain: "woottonlife-4b1ce.firebaseapp.com",
    projectId: "woottonlife-4b1ce",
    storageBucket: "woottonlife-4b1ce.appspot.com",
    messagingSenderId: "434984127011",
    appId: "1:434984127011:web:5f6195d6a08535c0d63f96",
    measurementId: "G-06XT35CJDS"
  };
const app = initializeApp(firebaseConfig);
const db=getFirestore();
const auth=getAuth();
const storage =getStorage();

export { db, auth, storage };