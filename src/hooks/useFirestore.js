import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection ,query, where, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
const auth = getAuth();

function useFirestore(collect, isDashboard){
    const [docs, setDocs] = useState([]);

    useEffect(() => {

        let q = query(collection(db, collect));

        if (auth.currentUser){
            q = query(collection(db, collect), where("uid", "==", auth.currentUser.uid));
        }
        const unsub = onSnapshot(q, (querySnapshot) => {
            let documents = [];
            querySnapshot.forEach((doc) => {
                if (isDashboard && doc.data().uid == auth.currentUser.uid || !isDashboard){
                    documents.push({...doc.data(), id: doc.id});
                    
                }
            });

        setDocs(documents);
        });
        return () => unsub();

    }, [collection])
    return {docs};
}


export default useFirestore;