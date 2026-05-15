// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLp2eapBTssmu8s5ZF_Lmuj8DAVU-xI0o",
    authDomain: "crashcourse-website.firebaseapp.com",
    projectId: "crashcourse-website",
    storageBucket: "crashcourse-website.firebasestorage.app",
    messagingSenderId: "298419981124",
    appId: "1:298419981124:web:70ce7241fd73a733c86511"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export{auth, db};