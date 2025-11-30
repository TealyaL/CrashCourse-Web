const login = (event) => {
    event.preventDefault();
    let email = document.querySelector("#email").value.trim();
    let password = document.querySelector("#password").value.trim();
   
    let users = localStorage.getItem("users")? JSON.parse(localStorage.getItem("users")) : {};

    let storageUser = users[email];

    if (storageUser && storageUser.password === password){
        window.location.href = "index.html";
    }else{
        alert("Failed to login.")
    }
}

document.querySelector(".login-form").addEventListener("submit", login);