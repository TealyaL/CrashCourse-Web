import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, addDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';

const fetchAndRenderCourses = async () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    let q;

    if (category) {
        q = query(collection(db, "courses"), where("category", "==", category));
    } else {
        q = query(collection(db, "courses"), orderBy("title", "asc"));
    }

    const querySnapshot = await getDocs(q);

    let html = "";

    querySnapshot.forEach((doc) => {
        const course = doc.data();
        const courseID = doc.id;

        html += `
        <div class="card col-lg-3 col-md-6">
            <img src="${course.imageUrl}" class="card-img-top" alt="${course.title}">
            <div class="card-body">
                <a href="./detail.html?id=${courseID}">
                    <h5>${course.title}</h5>
                </a>
                <p class="card-text">${course.description}</p>
                <a href="./detail.html?id=${courseID}" class="btn btn-warning">View</a>
            </div>
        </div>
    `;
    });

    document.querySelector("#course-list").innerHTML = html;
};

fetchAndRenderCourses();
