import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
    authDomain: "insta-intro-c9bf9.firebaseapp.com",
    projectId: "insta-intro-c9bf9",
    storageBucket: "insta-intro-c9bf9.appspot.com",
    messagingSenderId: "124642264933",
    appId: "1:124642264933:web:0dacfd8fe962d690b9038c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { app, auth, provider, signInWithPopup }