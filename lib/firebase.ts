import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAr31HDR7_cAapgS42hlE_bTDYlkgXTQzI",
  authDomain: "fireapp-46e87.firebaseapp.com",
  projectId: "fireapp-46e87",
  storageBucket: "fireapp-46e87.appspot.com",
  messagingSenderId: "776898521881",
  appId: "1:776898521881:web:dda74ea79a8dbfa344b388",
  measurementId: "G-PXXM8EHDF8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
