import { auth, db } from './firebase-config.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


const register = (event) => {
    event.preventDefault();
    //1. Lấy info
    let firstName = document.querySelector('#firstname').value.trim();
    let lastName = document.querySelector('#lastname').value.trim();
    let email = document.querySelector('#email').value.trim();
    let password = document.querySelector('#password').value.trim();
    let confirmPassword = document.querySelector('#confirm-password').value.trim();
    let gender = document.querySelectorAll('input[name="gender"]');
    let role_id = 0;
    let joinedClass = [];

    let lowerCaseLetter = /[a-z]/g;
    let upperCaseLetter = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !gender) {
        alert("Please fill in all the fields.");
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
    }

    if (!password.match(lowerCaseLetter)) {
        alert('Password must contain a lowercase letter.');
        return;
    }

    if (!password.match(upperCaseLetter)) {
        alert('Password must contain an uppercase letter.');
        return;
    }

    if (!password.match(numbers)) {
        alert('Password must contain a number.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    let selectedGender = ""
    for (let radio of gender) {
        if (radio.checked) {
            selectedGender = radio.value;
            break;
        }
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            const userData = {
                firstName,
                lastName,
                gender: selectedGender,
                email,
                password,
                role_id,
                joinedClass
            }
            return addDoc(collection(db, "users"), userData);
        })
        .then(()=>{
            alert("Signup successfully!");
            window.location.href = "login.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Failed to signup: ${errorMessage}`)
        });
}

document.querySelector('.signup-form').addEventListener('submit', register);