import { db } from "./firebase-config.js";
import { categories } from "./category.js";
import {collection,getDocs,query,orderBy,limit} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const popularContainer = document.getElementById("popularCourses");

const renderPopularCourses = async () => {
    try {
        const q = query(collection(db, "courses"),orderBy("enrollment", "desc"),limit(4));
        const querySnapshot = await getDocs(q);
        let html = "";

        querySnapshot.forEach((doc) => {
            const course = doc.data();
            const courseID = doc.id;

            html += `
                <div class="card col-lg-3 col-md-6">
                    <img src="${course.imageUrl}" class="card-img-top" alt="${course.title}">
                    <div class="card-body">
                        <a href="./detail.html?id=${courseID}" class="card-title"><h5>${course.title}</h5></a>
                        <p class="card-text">${course.description}</p>
                        <a href="./detail.html?id=${courseID}" 
                            class="btn btn-warning">View</a>
                    </div>
                </div>
            `;
        });
        popularContainer.innerHTML = html;

    } catch (err) {
        console.log(err);
        popularContainer.innerHTML = `
            <p>Failed to load courses.</p>
        `;
    }
};

renderPopularCourses();

const categoryContainer = document.querySelector("#category-list");

const loadCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courses = [];

        querySnapshot.forEach((document) => {courses.push(document.data());});

        categoryContainer.innerHTML = categories.map(cat => {
            const courseCount = courses.filter(course => course.category === cat.key).length;

            return `
                <a href="./explore.html?category=${cat.key}" class="col-lg-3 col-md-6 col-sm-3">
                    <div class="card mb-3" style="max-width: 300px;">
                        <div class="row g-0">
                            <div class="col-md-4 image-container">
                                <img src="${cat.imageUrl}" class="img-fluid rounded-start" alt="${cat.name}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${cat.name}</h5>
                                    <p class="card-text">${courseCount} course${courseCount !== 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            `;
        }).join("");

    } catch (err) {
        console.log(err);
        categoryContainer.innerHTML = `
            <p>Failed to load categories.</p>
        `;
    }
};

loadCategories();
