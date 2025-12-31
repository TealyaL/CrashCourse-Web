const fetchAndRenderCourses = async () => {
    const response = await fetch("./data/data.json");
    const data = await response.json();

    const courseList = document.querySelector("#course-list");

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    let filteredData = category
    if (category){
        filteredData = data.filter(course => course.category === category);
    } else{
        filteredData = data;
    };

    courseList.innerHTML = filteredData.map(course => `
        <div class="card col-lg-3 col-md-6">
            <img src="${course.image}" class="card-img-top" alt="${course.title}">
            <div class="card-body">
                <a href="./detail.html?id=${course.id}">
                    <h5>${course.title}</h5>
                </a>
                <p class="card-text">${course.description}</p>
                <a href="./detail.html?id=${course.id}" class="btn btn-warning">View</a>
            </div>
        </div>
    `).join("");
};

fetchAndRenderCourses();
