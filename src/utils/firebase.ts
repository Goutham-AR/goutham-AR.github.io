// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFoKEt9V1wRMc2gc42XDSMRn9W1CCgQ9w",
  authDomain: "my-portfolio-a9c8c.firebaseapp.com",
  projectId: "my-portfolio-a9c8c",
  storageBucket: "my-portfolio-a9c8c.firebasestorage.app",
  messagingSenderId: "764649946530",
  appId: "1:764649946530:web:51b8f900b578ea482686fb",
  measurementId: "G-LRL62EKZCT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);