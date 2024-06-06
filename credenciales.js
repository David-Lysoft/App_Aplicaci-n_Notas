// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAczj1mddcJ4Idy6rL9jVG_PTETqNMJAZA",
  authDomain: "appnotes-e5e24.firebaseapp.com",
  projectId: "appnotes-e5e24",
  storageBucket: "appnotes-e5e24.appspot.com",
  messagingSenderId: "387336649439",
  appId: "1:387336649439:web:6006e9801ad6d75ce5076a"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;