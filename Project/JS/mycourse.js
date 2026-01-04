let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Account
// Display Account Info
const fetchInfo = () => {
    let container = document.querySelector('.content-container');
    if (currentUser) {
        container.innerHTML = `
            <div class="name">
                <p>Name: ${currentUser.firstName} ${currentUser.lastName}</p>
            </div>
            <div class="gender">
                <p>Gender: ${currentUser.gender}</p>
            </div>
            <div class="email">
                <p>Email: ${currentUser.email}</p>
            </div>
            <br>
            <button class="btn btn-warning edit">Edit</button>
            <button class="btn btn-danger logout">Logout</button>
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
    localStorage.removeItem('currentUser');
    window.location.reload();
}
document.querySelector('.logout').addEventListener('click', logout)

// Classes
let classContainer = document.querySelector(".class");

let joinedClass = JSON.parse(localStorage.getItem('joinedClass')) || [];

const renderClassItem = async () => {
    const response = await fetch("./data/data.json");
    const data = await response.json();

    classContainer.innerHTML = [];

    if (currentUser) {
        if (joinedClass.length !== 0) {
            classContainer.innerHTML = joinedClass.map(itemJoinedClass => {
                let classes = itemJoinedClass;
                return `
            <div class="card col-lg-3 col-md-6">
                <img src="${classes.image}" class="card-img-top"
                    alt="${classes.title}">
                <div class="card-body">
                    <a href="./detail.html?id=${classes.id}" class="card-title">
                        <h5>${classes.title}</h5>
                    </a>
                    <a href="./detail.html?id=${classes.id}" class="btn btn-warning">View</a>
                    <div onclick="removeItem(${classes.id})" class="btn btn-danger">Remove</div>
                </div>
            </div>
        `
            }).join("")
        }

        classContainer.innerHTML += `
        <div class="card col-lg-3 col-md-6">
            <a href="./explore.html">
                <div class="card-img-top gray">
                    <p><i class="fa-solid fa-circle-plus"></i></p>
                </div>
            </a>
            <div class="card-body">
                <h5>Add more course</h5>
                <a href="./explore.html" class="btn btn-warning">Go</a>
            </div>
        </div>
    `}
};

const removeItem = (id) => {
    joinedClass = joinedClass.filter(item => item.id !== id);
    localStorage.setItem("joinedClass", JSON.stringify(joinedClass));
    renderClassItem();
};

renderClassItem();
