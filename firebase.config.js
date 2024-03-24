// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbQqcz9Jm8KYyZnmppqhASXdvdOGZlfVA",
  authDomain: "aceup-6a427.firebaseapp.com",
  projectId: "aceup-6a427",
  storageBucket: "aceup-6a427.appspot.com",
  messagingSenderId: "89832305870",
  appId: "1:89832305870:web:b08dae5e3fb61bc9874c9f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
