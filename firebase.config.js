// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeYiC3z9Ob8QVMk6tkISuMREzwU4cNOVw",
  authDomain: "aceup-bb001.firebaseapp.com",
  projectId: "aceup-bb001",
  storageBucket: "aceup-bb001.appspot.com",
  messagingSenderId: "986391417876",
  appId: "1:986391417876:web:217e8d163143f368b20301",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
