// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVNl-RCXBI6NKoteEI1Ovn6V2cX4nvwww",
  authDomain: "find-tutor-5398a.firebaseapp.com",
  projectId: "find-tutor-5398a",
  storageBucket: "find-tutor-5398a.firebasestorage.app",
  messagingSenderId: "977234363004",
  appId: "1:977234363004:web:5a56efde2370a503697ff9"
};

// Initialize Firebase
const initializeFirebase = () => {
    initializeApp(firebaseConfig)
}

// Initialize Firebase
export default initializeFirebase;