// header
const displayHeader = () => {
    header = document.querySelector('header');
    header.innerHTML =
        `
    <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-header">
        <a class="navbar-brand" href="./index.html">
            <img class="logo" src="./img/logo.png" alt="Crash Course Ed's logo">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup">
            <i class="fa fa-bars"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-link" href="./index.html">Home</a>
                <a class="nav-link" href="./explore.html">Explore Courses</a>
                <a class="nav-link account-header" href="./login.html">Login</a>
            </div>
        </div>
    </nav>
    `;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.querySelector('.account-header').innerText = 'My Account';
        document.querySelector('.account-header').href = './mycourse.html';
    }
}
displayHeader();

// footer
const displayFooter = async () => {
    footer = document.querySelector('footer');
    if (footer) {
        categories = await (await fetch('./data/categories.json')).json();

        footer.innerHTML = `
        <div class="row">
                <div class="footer-content col-4">
                    <h5>CrashCourse Ed</h5>
                    <ul>
                        <li><a href="./index.html" class="footer-link">Home</a></li>
                        <li><a href="./index.html#about" class="footer-link">About</a></li>
                        <li><a href="./index.html#popular" class="footer-link">Popular Courses</a></li>
                        <li><a href="./explore.html" class="footer-link">Explore by Category</a></li>
                        <li><a href="./signup.html" class="footer-link account-footer">Join Now</a></li>
                    </ul>
                </div>
                <div class="footer-content col-4">
                    <h5>Categories</h5>
                    <ul id="footer-categories"></ul>
                </div>
                <div class="footer-content col-4">
                    <h5>Contact</h5>
                    <ul>
                        <li><a href="mailto:minhthyle198@gmail.com" class="footer-link"><i class="fa-solid fa-inbox"></i>
                                contact@crashcourse.com</a></li>
                        <li><a href="tel:0886788468" class="footer-link"><i class="fa-solid fa-phone"></i> 0886788468</a>
                        </li>
                        <li><a href="www.facebook.com" class="footer-link"><i class="fa-brands fa-facebook-f"></i>
                                CrashCourse Ed</a></li>
                        <li><a href="www.linkedin.com" class="footer-link"><i class="fa-brands fa-linkedin"></i> CrashCourse
                                Ed</a></li>
                        <li><a href="www.x.com" class="footer-link"><i class="fa-brands fa-x-twitter"></i> CrashCourse
                                Ed</a></li>
                    </ul>
                </div>
            </div>
            <p> &copy; CrashCourse Education 2025. All right reserved.</p>
        `
        document.querySelector("#footer-categories").innerHTML = categories.map(cat => {
            return `
            <li>
                <a href="./explore.html?category=${cat.key}" class="footer-link">${cat.name}</a>
            </li>
        `;
        }).join("");

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.querySelector('.account-footer').innerText = 'My Account';
            document.querySelector('.account-footer').href = './mycourse.html';
        }
    }
};

displayFooter();