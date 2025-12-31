const login = (event) => {
    event.preventDefault();
    let email = document.querySelector("#email").value.trim();
    let password = document.querySelector("#password").value.trim();
   
    let users = localStorage.getItem("users")? JSON.parse(localStorage.getItem("users")) : {};

    let storageUser = users[email];

    if (storageUser && storageUser.password === password){
        localStorage.setItem("currentUser", JSON.stringify(storageUser));
        if ((document.referrer.includes('signup.html'))){
            window.history.go(-2);
        }else{
            window.history.back()
        }
    }else{
        alert("Failed to login.")
    }
}

document.querySelector(".login-form").addEventListener("submit", login);