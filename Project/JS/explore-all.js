const fetchData = async () =>{
    let response = await fetch("./data.json");
    let data = await response.json();

    let allCourseList = document.querySelector("#course-list");
    allCourseList.innerHTML = data.map(item =>{
        return `
        <div class="card col-lg-3 col-md-6">
            <img src="${item.image}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <a href="${item.page}" class="card-title">
                    <h5>${item.title}</h5>
                </a>
                <p class="card-text">${item.description}</p>
                <a href="${item.page}" class="btn btn-warning">View</a>
            </div>
        </div>
        `
    }).join("");
}

fetchData()
