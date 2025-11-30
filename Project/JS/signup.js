const register = (event) => {
    event.preventDefault();
    //1. Lấy info
    let firstName = document.querySelector('#firstname').value.trim();
    let lastName = document.querySelector('#lastname').value.trim();
    let email = document.querySelector('#email').value.trim();
    let password = document.querySelector('#password').value.trim();
    let confirmPassword = document.querySelector('#confirm-password').value.trim();
    let gender = document.querySelectorAll('input[name="gender"]');

    let lowerCaseLetter = /[a-z]/g;
    let upperCaseLetter = /[A-Z]/g;
    let numbers = /[0-9]/g;

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

    for (let radio of gender) {
        if (radio.checked) {
            selectedGender = radio.value;
            break;
        }
    }

    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};

    if (users[email]) {
        alert('Email already registered!');
    } else {
        users[email] = { firstName: firstName, lastName: lastName, email: email, password: password, gender: selectedGender};
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = "./login.html"
    }
}

document.querySelector('.signup-form').addEventListener('submit', register);