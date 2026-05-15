import { auth, db } from "./firebase-config.js";
import { collection, getDocs, addDoc, deleteDoc, doc, where, query, orderBy } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { checkSession } from "./check_session.js";

let userSession = JSON.parse(localStorage.getItem("user_session"));
checkSession;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!userSession) {
            alert("Please log in to access this page!");
            window.location.href = "./index.html";
            return;
        }

        const email = userSession.user.email;
        const q = query(collection(db, "users"), where("email", "==", email))
        const querySnapShot = await getDocs(q);

        if (querySnapShot.empty) {
            alert("No matched user found!");
            window.location.href = "./index.html";
            return;
        }
        querySnapShot.forEach(doc => {
            const user = doc.data();
            if (user.role_id !== 1) {
                alert("You do not have access to this page!")
                window.location.href = "./index.html"
                return;
            }
        })

    } catch (err) {
        alert(err)
    }
})

const loadCourses = async () => {
    const q = query(collection(db, "courses"), orderBy("title", "asc"));

    const querySnapshot = await getDocs(q);

    let html = "";

    querySnapshot.forEach((doc) => {
        const course = doc.data();
        const courseID = doc.id;

        html += `
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card h-100">
            <img src="${course.imageUrl}" class="card-img-top" alt="${course.title}">
            <div class="card-body d-flex flex-column">
                <a href="./detail.html?id=${courseID}" class="card-title">
                    <h5>${course.title}</h5>
                </a>
                <p class="card-text">${course.description}</p>
                <a href="./detail.html?id=${courseID}" class="btn btn-warning mt-auto">View</a>
                <a class="btn btn-danger remove" data-id="${courseID}">Remove</a>
            </div>
        </div>
    </div>
`;
    });

    document.querySelector("#course-list").innerHTML = html;
}

const fetchAndRenderInfo = async () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    const container = document.querySelector(".content-container")

    if (tab == "courses") {
        container.innerHTML = `
                <div class="row">
                    <h2 class="col-lg-4">All Courses</h2>
                    <div class="col-lg-5"></div>
                    <div class="button-container col">
                        <button class="add btn">Add course</button>
                    </div>
                </div>

                <div class="row g-4" id="course-list"></div>
        `
        await loadCourses();

        document.querySelector(".add").addEventListener("click", () => {
            window.location.href = "./admin.html?tab=add-course";
        });

        removeCourse();
    }
    else if (tab == "coming_soon") {
        container.innerHTML = `<h2>Coming Soon!</h2>`
    }
    else if (tab == "add-course") {
        container.innerHTML = `
        <h2>Add New Course</h2>
                <form id="add-course-form">
                    <!-- Title -->
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" name="title" required>
                    </div>
                    <!-- Instructor -->
                    <div class="mb-3">
                        <label for="instructor" class="form-label">Instructor</label>
                        <input type="text" class="form-control" id="instructor" name="instructor" required>
                    </div>
                    <!-- Category -->
                    <div class="mb-3">
                        <label class="form-label">Category</label>
                        <div class="input-field">
                            <input type="radio" id="business" name="category" value="business" required>
                            <label for="business" class="radio">Business</label>
                            <input type="radio" id="computer_science" name="category" value="computer_science" required>
                            <label for="computer_science" class="radio">Computer Science</label>
                            <input type="radio" id="health" name="category" value="Health" required>
                            <label for="health" class="radio">Health</label>
                            <input type="radio" id="physical_science" name="category" value="physical_science" required>
                            <label for="physical_science" class="radio">Physical Science</label>
                            <input type="radio" id="other" name="category" value="other" required>
                            <label for="other" class="radio">Other (comming soon)</label>
                        </div>
                    </div>
                    <!-- Level -->
                    <div class="mb-3">
                        <label class="form-label">Level</label>
                        <div class="input-field">
                            <input type="radio" id="beginner" name="level" value="Beginner" required>
                            <label for="beginner" class="radio">Beginner</label>
                            <input type="radio" id="intermediate" name="level" value="Intermediate" required>
                            <label for="intermediate" class="radio">Intermediate</label>
                            <input type="radio" id="advanced" name="level" value="Advanced" required>
                            <label for="advanced" class="radio">Advanced</label>
                        </div>
                    </div>
                    <!-- Description -->
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <input type="text" class="form-control" id="description" name="description" required>
                    </div>
                    <!-- Length -->
                    <div class="mb-3">
                        <label for="length" class="form-label">Length</label>
                        <input type="number" class="form-control" id="length" name="length" min="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="length-description" class="form-label">Length Description</label>
                        <input type="text" class="form-control" id="length-description" name="length-description" required>
                    </div>
                    <!-- Skill Outcomes -->
                    <div class="mb-3">
                        <label for="skill-input" class="form-label">Skill Outcomes</label>

                        <div class="d-flex gap-2 mb-2">
                            <input type="text" class="form-control" id="skill-input">
                            <button type="button" class="btn" id="add-skill-btn">Add</button>
                        </div>

                        <ul class="list-group" id="skill-list"></ul>

                        <!-- Hidden input to submit data -->
                        <input type="hidden" name="skills" id="skills-data">
                    </div>

                    <!-- Learning Outcomes -->
                    <div class="mb-3">
                        <label for="learning-input" class="form-label">Learning Outcomes</label>

                        <div class="d-flex gap-2 mb-2">
                            <input type="text" class="form-control" id="learning-input">
                            <button type="button" class="btn" id="add-learning-btn">Add</button>
                        </div>

                        <ul class="list-group" id="learning-list"></ul>

                        <!-- Hidden input to submit data -->
                        <input type="hidden" name="learning_outcomes" id="learning-data">
                    </div>
                    <div class="mb-3">
                        <label for="product_image" class="form-label">Photo</label>
                        <input type="file" class="form-control" id="product_image" name="product_image" accept="image/*"
                            required>
                    </div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary rounded-sm me-2">Save</button>
                        <button type="reset" class="btn btn-cancle rounded-sm btn-warning me-2">Reset</button>
                        <a class="btn btn-danger" href="./admin.html?tab=courses">Back</a>
                    </div>
                </form>
        `
        handleListInput();

        const form = document.querySelector("#add-course-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {

                const imageFile = document.querySelector("#product_image").files[0];
                const formData = new FormData();
                formData.append("image", imageFile);

                const response = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formData,
                });

                const contentType = response.headers.get("content-type") || "";

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload failed (${response.status}): ${errorText.slice(0, 200)}`);
                }

                if (!contentType.includes("application/json")) {
                    const bodyText = await response.text();
                    throw new Error(`Upload did not return JSON: ${bodyText.slice(0, 200)}`);
                }

                const data = await response.json();

                const imageUrl = data.imageUrl;

                // Save to Firestore
                await addDoc(collection(db, "courses"), {
                    title: document.querySelector("#title").value,
                    instructor: document.querySelector("#instructor").value,
                    category: document.querySelector('input[name="category"]:checked').value,
                    level: document.querySelector('input[name="level"]:checked').value,
                    description: document.querySelector("#description").value,
                    length: Number(document.querySelector("#length").value),
                    lengthDescription: document.querySelector("#length-description").value,

                    skills: JSON.parse(document.querySelector("#skills-data").value || "[]"),

                    learningOutcomes: JSON.parse(document.querySelector("#learning-data").value || "[]"),

                    imageUrl: imageUrl,

                    enrollment: 0,
                    feedback: 0,
                    like: 0,
                    rating: 0.0
                });

                alert("Course added successfully!");

                window.location.href = "./admin.html?tab=courses";

            } catch (err) {
                console.log(err);
                alert("Error adding course");
            }
        });
    }
}

const handleListInput = () => {
    const skills = [];
    const learningOutcomes = [];

    // Skill Outcomes
    const skillInput = document.getElementById("skill-input");
    const addSkillBtn = document.getElementById("add-skill-btn");
    const skillList = document.getElementById("skill-list");
    const skillsData = document.getElementById("skills-data");
    skillsData.value = "[]";

    addSkillBtn.addEventListener("click", () => {
        const value = skillInput.value.trim();

        if (value === "") return;

        skills.push(value);

        renderSkills();

        skillInput.value = "";
    });

    let renderSkills = () => {
        skillList.innerHTML = "";

        skills.forEach((skill, index) => {
            const li = document.createElement("li");

            li.className =
                "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
            ${skill}
            <button type="button"
                class="btn btn-danger btn-sm remove-btn"
                onclick="removeSkill(${index})">
                Remove
            </button>
        `;

            skillList.appendChild(li);
        });

        skillsData.value = JSON.stringify(skills);
    }

    window.removeSkill = function (index) {
        skills.splice(index, 1);
        renderSkills();
    };

    // Learning Outcomes
    const learningInput = document.getElementById("learning-input");
    const addLearningBtn = document.getElementById("add-learning-btn");
    const learningList = document.getElementById("learning-list");
    const learningData = document.getElementById("learning-data");
    learningData.value = "[]";

    addLearningBtn.addEventListener("click", () => {
        const value = learningInput.value.trim();

        if (value === "") return;

        learningOutcomes.push(value);

        renderLearningOutcomes();

        learningInput.value = "";
    });

    let renderLearningOutcomes = () => {
        learningList.innerHTML = "";

        learningOutcomes.forEach((item, index) => {
            const li = document.createElement("li");

            li.className =
                "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
            ${item}
            <button type="button"
                class="btn btn-danger btn-sm"
                onclick="removeLearning(${index})">
                Remove
            </button>
        `;

            learningList.appendChild(li);
        });

        learningData.value = JSON.stringify(learningOutcomes);
    }

    window.removeLearning = function (index) {
        learningOutcomes.splice(index, 1);
        renderLearningOutcomes();
    };
};

const removeCourse = () =>{
    const removeButtons = document.querySelectorAll(".remove");

    removeButtons.forEach((button) => {
        button.addEventListener("click", async () => {

            const courseID = button.dataset.id;
            const confirmDelete = confirm("Are you sure you want to delete this course?");

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, "courses", courseID));
                alert("Course deleted successfully!");
                loadCourses();

            } catch (err) {

                console.log(err);
                alert("Failed to delete course");
            }
        });
    });
}

fetchAndRenderInfo();

