const popularContainer = document.getElementById("popularCourses");

const renderPopularCourses = async () => {
    const response = await fetch("./data/data.json");
    const data = await response.json();

    let popularCourses = data.sort((a, b) => {
            const enrollA = Number(a.enrolledNum.replace(/,/g, ""));
            const enrollB = Number(b.enrolledNum.replace(/,/g, ""));
            return enrollB - enrollA;
        }).slice(0, 4);

    popularContainer.innerHTML = popularCourses.map(course => `
        <div class="card col-lg-3 col-md-6">
            <img src="${course.image}" class="card-img-top" alt="${course.title}">
            <div class="card-body">
                <a href="./detail.html?id=${course.id}" class="card-title">
                    <h5>${course.title}</h5>
                </a>
                <p class="card-text">${course.description}</p>
                <a href="./detail.html?id=${course.id}" class="btn btn-warning">View</a>
            </div>
        </div>
    `).join("");
};

renderPopularCourses();

const categoryContainer = document.querySelector("#category-list");

const loadCategories = async () => {
    const response = await fetch("./data/data.json");
    const data = await response.json();

    const categories = await (await fetch("./data/categories.json")).json();

    categoryContainer.innerHTML = categories.map(cat => {
        const courseCount = data.filter(
            course => course.category === cat.key
        ).length;

        return `
        <a href="./explore.html?category=${cat.key}" class="col-lg-3 col-md-6 col-sm-3">
            <div class="card mb-3" style="max-width: 300px;">
                <div class="row g-0">
                    <div class="col-md-4 image-container">
                        <img src="./img/${cat.key}-category.jpg" class="img-fluid rounded-start" alt="${cat.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${cat.name}</h5>
                            <p class="card-text">
                                ${courseCount} course${courseCount !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
        `;
    }).join("");
}

loadCategories();
