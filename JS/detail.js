const fetchDetail = async () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get("id"));

    const response = await fetch("./data/data.json");
    const data = await response.json();

    const course = data.find(c => c.id === courseId);

    let courseTitle = document.querySelector("title");
    let detailContainer = document.querySelector(".course-detail");
    
    if (course) {
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
                        <img src="${course.image}" alt="${course.title}">
                    </div>
                    <div class="course-title col-lg-6">
                        <h2>${course.title}</h2>
                        <p>Instructor: ${course.instructor}</p>
                        <a href="#" onclick="addItem()" class="enroll btn btn-warning btn-lg">Enroll for Free!</a>
                        <p>${course.enrolledNum} already enrolled</p>
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
}

const currentUser = localStorage.getItem('currentUser');

const addItem = async () => {
    if (currentUser) {
        const params = new URLSearchParams(window.location.search);
        const courseId = parseInt(params.get("id"));

        const response = await fetch("./data/data.json");
        const data = await response.json();

        const course = data.find(c => c.id === courseId);

        let joinedClass = JSON.parse(localStorage.getItem("joinedClass")) || [];

        const alreadyJoined = joinedClass.find(c => c.id === courseId);
        if (alreadyJoined) {
            alert("You have already enrolled in this course!");
            return;
        } else {
            joinedClass.push(course);
        }

        localStorage.setItem("joinedClass", JSON.stringify(joinedClass));

        alert("Successfully enrolled in this course!");
    } else{
        alert("Please login to join this course.")
        window.location.href = './login.html'
    }
};


fetchDetail()