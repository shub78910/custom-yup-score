import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3uaRnVQNAQu1tKdXdgF1w2hbCL9Jbo2o",
  authDomain: "score-me-8ccc3.firebaseapp.com",
  projectId: "score-me-8ccc3",
  storageBucket: "score-me-8ccc3.appspot.com",
  messagingSenderId: "505326801420",
  appId: "1:505326801420:web:5958a95cbb03d01a7c1429",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };
