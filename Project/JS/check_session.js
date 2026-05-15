export const checkSession = (event) => {
    let userSession = localStorage.getItem("user_session");

    if (userSession) {
        const now = new Date().getTime();

        if (now > userSession.expiry) {
            alert("Time out! Please login again.")
            localStorage.removeItem("user_storage");
            window.location.href = "login.html";
        }
    }
}