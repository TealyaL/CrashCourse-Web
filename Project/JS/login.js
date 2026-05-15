import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const login = async (event) => {
    event.preventDefault();
    let email = document.querySelector("#email").value.trim();
    let password = document.querySelector("#password").value.trim();

    if (!email || !password) {
        alert("Please fill in all the fields.");
        return;
    }

    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();

            const userSession = {
                user: userData,
                expiry: Date.now() + 2 * 60 * 60 * 1000
            };

            localStorage.setItem("user_session", JSON.stringify(userSession));
            alert("Login successfully!")
            window.location.href = "./index.html"
        } else {
            alert("No user data found!");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
    }
};

document.querySelector(".login-form").addEventListener("submit", login);