import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, addDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';
let currentUser = JSON.parse(localStorage.getItem('user_session'));

// Account
// Display Account Info
const fetchInfo = () => {
    let container = document.querySelector('.content-container');
    if (currentUser && currentUser.user.role_id == 0) {
        container.innerHTML = `
            <div class="name">
                <p>Name: ${currentUser.user.firstName} ${currentUser.user.lastName}</p>
            </div>
            <div class="gender">
                <p>Gender: ${currentUser.user.gender}</p>
            </div>
            <div class="email">
                <p>Email: ${currentUser.user.email}</p>
            </div>
            <br>
            <button class="btn btn-warning edit">Edit</button>
            <button class="btn btn-danger logout">Logout</button>
            `
    }
    else if (currentUser && currentUser.user.role_id == 1) {
        container.innerHTML = `
            <div class="name">
                <p>Name: ${currentUser.user.firstName} ${currentUser.user.lastName}</p>
            </div>
            <div class="gender">
                <p>Gender: ${currentUser.user.gender}</p>
            </div>
            <div class="email">
                <p>Email: ${currentUser.user.email}</p>
            </div>
            <br>
            <button class="btn btn-warning edit">Edit</button>
            <button class="btn btn-danger logout">Logout</button>
            <a href="./admin.html?tab=courses" class="btn admin-page">Admin Page</a>
            `
    } else {
        container.innerHTML =
            `<p>You haven't logged into your account.</p>
        <a href="./login.html" class="btn btn-warning">Login</a>
        <p>- or -</p>
        <a href="./signup.html" class="btn btn-warning">Sign Up</a>`
    }
}
fetchInfo();


// Logout
const logout = () => {
    localStorage.removeItem('user_session');
    window.location.reload();
}
document.querySelector('.logout').addEventListener('click', logout)

// Classes
let classContainer = document.querySelector(".class");

let joinedClass = [];

const renderClassItem = async () => {
    classContainer.innerHTML = "";

    joinedClass = currentUser.user.joinedClass

    // Render joined classes
    if (joinedClass.length !== 0) {

        classContainer.innerHTML = joinedClass.map(classes => {
            return `
                <div class="card col-lg-3 col-md-6">
                    <img src="${classes.imageUrl}" class="card-img-top"alt="${classes.title}">
                    <div class="card-body">
                        <a href="./detail.html?id=${classes.id}" class="card-title"><h5>${classes.title}</h5></a>
                        <div class="card-buttons">
                            <a href="./detail.html?id=${classes.id}" class="btn btn-warning">View</a>
                            <button onclick="removeItem('${classes.id}')" class="btn btn-danger">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    // Add Course Card
    classContainer.innerHTML += `
        <div class="card col-lg-3 col-md-6">
            <a href="./explore.html">
                <div class="card-img-top gray">
                    <p><i class="fa-solid fa-circle-plus"></i></p>
                </div>
            </a>

            <div class="card-body">
                <h5>Add more course</h5>
                <div class="card-buttons">
                    <a href="./explore.html" class="btn btn-warning">Go</a>
                </div>
            </div>
        </div>
    `;
};

window.removeItem = async (id) => {

    joinedClass = joinedClass.filter(item => String(item.id) !== String(id));

    const q = query(collection(db, "users"), where("email", "==", currentUser.user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return;
    
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "users", userDoc.id), {joinedClass: joinedClass});
    currentUser.user.joinedClass = joinedClass;

    localStorage.setItem("user_session",JSON.stringify(currentUser));
    renderClassItem();
};

renderClassItem();
