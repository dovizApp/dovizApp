import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {

    apiKey: "AIzaSyAKK-3I9sciebFbsReaQYt51pwFm7UFedw",
    authDomain: "dovizapp-c6e1a.firebaseapp.com",
    projectId: "dovizapp-c6e1a",
    storageBucket: "dovizapp-c6e1a.appspot.com",
    messagingSenderId: "753739964508",
    appId: "1:753739964508:web:4da823f9682ee5e4afc699",
    measurementId: "G-B9H76X2SKW"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}