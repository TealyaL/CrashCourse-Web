import { db } from './firebase-config.js';
import { checkSession } from './check_session.js';
import { collection, query, getDocs, doc, getDoc, addDoc, updateDoc, where, arrayUnion } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';

checkSession();

const fetchDetail = async () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    let courseTitle = document.querySelector("title");
    let detailContainer = document.querySelector(".course-detail");
    let levelDescription;
    let likeDescription;
    if (docSnap.exists()) {
        const course = docSnap.data();

        let learningOutcomeHtml = course.learningOutcome.map(criteria => {
            return `<li>${criteria}</li>`
        }).join("");
        let skillOutcomeHtml = course.skillOutcome.map(criteria => {
            return `<li>${criteria}</li>`
        }).join("");

        if (course.level === "Beginner") {
            levelDescription = "No prior experience required.";
        } else if (course.level === "Intermediate") {
            levelDescription = "Some related experience required.";
        } else if (course.level === "Advanced") {
            levelDescription = "Significant prior experience required.";
        }

        if (course.like === 100) {
            likeDescription = "All learner liked this course."
        } else if (course.like >= 50) {
            likeDescription = "Most learner liked this course."
        } else {
            likeDescription = "Many learner liked this course."
        }

        courseTitle.innerHTML = `${course.title} | CrashCourse Ed`

        detailContainer.innerHTML = `
            <!-- title -->
            <section class="title blue-section">
                <div class="row">
                    <div class="course-image col-lg-6">
                        <img src="${course.imageUrl}" alt="${course.title}">
                    </div>
                    <div class="course-title col-lg-6">
                        <h2>${course.title}</h2>
                        <p>Instructor: ${course.instructor}</p>
                        <a href="#" class="enroll btn btn-warning btn-lg">Enroll for Free!</a>
                        <p>${course.enrollment} already enrolled</p>
                    </div>
                </div>
            </section>

            <!-- course description -->
            <section class="description white-section container-fluid">
                <!-- stats -->
                <div class="stats card-group">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${course.length} course series</h5>
                            <p class="card-text">${course.lengthDescription}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${course.rating} <i class="fa-solid fa-star"></i></h5>
                            <p class="card-text">(${course.feedbackNum} feedbacks)</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${course.level} level</h5>
                            <p class="card-text">${levelDescription}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Flexible schedule</h5>
                            <p class="card-text">Learn at your own pace.</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fa-solid fa-thumbs-up"></i> ${course.like}%</h5>
                            <p class="card-text">${likeDescription}</p>
                        </div>
                    </div>
                </div>

                <h3>What you will learn</h3>
                <ul>
                    ${learningOutcomeHtml}
                </ul>

                <h3>Skill you will gain</h3>
                <ul>
                    ${skillOutcomeHtml}
                </ul>
            </section>
        `
    } else {
        detailContainer.innerHTML = `
            <p>This course is not available.</p>
        `
    }

    detailContainer.querySelector(".enroll").addEventListener("click", addItem);
}

const addItem = async () => {
    const user = JSON.parse(localStorage.getItem("user_session"));

    if (!user) {
        alert("Please login to join this course.");
        window.location.href = './login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const course = { id: courseId, ...docSnap.data() };

    const q = query(collection(db, "users"), where("email", "==", user.user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("User not found!");
        return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    const alreadyJoined = userData.joinedClass?.some(c => c.id === courseId);

    if (alreadyJoined) {
        alert("You have already enrolled in this course!");
        return;
    }

    await updateDoc(userRef, {
        joinedClass: arrayUnion(course)
    });

    user.user.joinedClass = [...(user.user.joinedClass), course];

    localStorage.setItem("user_session",JSON.stringify(user)
    );

    alert("Successfully enrolled in this course!");
};

fetchDetail()