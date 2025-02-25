document.addEventListener("DOMContentLoaded", () => {
    const whiteBanner = document.getElementById("white-banner");
    const blackBanner = document.getElementById("black-banner");
    let black = `<div class="scroll-content">
                    <div class="logo-item">
                        <img src="Assets/Black Banner/t1.png" alt="Logo 1">
                    </div>
                    <div class="logo-item">
                        <img src="Assets/Black Banner/t2.png" alt="Logo 2">
                    </div>
                    <div class="logo-item">
                        <img src="Assets/Black Banner/t3.png" alt="Logo 3">
                    </div>
                </div>`;
    let white = `<div class="scroll-content">
                    <div class="logo-item">
                        <img src="Assets/White Banner/t1.png" alt="Logo 1">
                    </div>
                    <div class="logo-item">
                        <img src="Assets/White Banner/t2.png" alt="Logo 2">
                    </div>
                    <div class="logo-item">
                        <img src="Assets/White Banner/t3.png" alt="Logo 3">
                    </div>
                </div>`
    for (let i = 0; i < 3; i++) {
        whiteBanner.innerHTML += white;
        blackBanner.innerHTML += black;
    }

    const coordinators = document.getElementById('coordinator');
    const projectContainer = document.getElementById('projects');
    const searchInput = document.getElementById('projectSearch');
    const filterTags = document.querySelectorAll('.filter-tag');

    let projectsData = [];
    let activeCategory = 'all';
    let searchTerm = '';

    async function fetchData() {
        try {
            let response = await fetch('data.json');
            let data = await response.json();

            data.coordinator.forEach(person => {
                let coordinator = `<div class="coordinator-card fade-in">
                <img src="Assets/Coordinators/${person.img}" alt="Coordinator ${person.id}" class="coordinator-img">
                <h3>${person.name}</h3>
                <p>${person.designation}</p>
                <p>${person.department}</p>
            </div>`;
                coordinators.innerHTML += coordinator;
            });

            projectsData = data.projects;
            renderProjects();

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();

    searchInput.addEventListener('input', function (e) {
        searchTerm = e.target.value.toLowerCase().trim();
        renderProjects();
    });

    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tag
            this.classList.add('active');

            // Update active category
            activeCategory = this.getAttribute('data-category');

            // Re-render projects
            renderProjects();
        });
    });

    function renderProjects() {
        // Clear current projects
        projectContainer.innerHTML = '';

        if (projectsData.length === 0) {
            return; // If data hasn't loaded yet, don't proceed
        }

        // Filter projects based on category and search term
        const filteredProjects = projectsData.filter(project => {
            const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                (project.detail && project.detail.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesSearch;
        });

        // Create HTML for each project using your existing template
        filteredProjects.forEach(project => {
            let projectCard = `<div class="project-card fade-in" data-category="${project.category}" data-id="${project.id}">
                <img src="Assets/${project.id}/${project.logo}" alt="Project ${project.id}" class="project-img">
                <div class="project-caption">
                    <h3>${project.title}</h3>
                    <p>${project.detail}</p>
                </div>
            </div>`;
            projectContainer.innerHTML += projectCard;
        });
    }

    // Add a single event listener to the container using event delegation
    projectContainer.addEventListener('click', (event) => {
        // Find the closest parent project-card element
        const projectCard = event.target.closest('.project-card');

        // If a project card was clicked (or something inside it)
        if (projectCard) {
            // Get the project ID or any other data you need to pass
            const projectId = projectCard.getAttribute('data-id') || projectCard.dataset.category;

            // Navigate to project.html with query parameter
            window.location.href = `project.html?id=${projectId}`;
        }
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Theme Toggle
    const themeToggle = document.querySelector(".theme-toggle");
    const body = document.body;
    const icon = themeToggle.querySelector("i");

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-theme");
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    });

    // Carousel Animation
    document.addEventListener("DOMContentLoaded", () => {
        const track = document.querySelector(".carousel-track");

        // Function to handle the infinite scroll effect
        function resetAnimation() {
            track.style.animation = "none";
            track.offsetHeight; // Trigger reflow
            track.style.animation = "carousel 10s linear infinite";
        }

        // Reset animation when it completes
        track.addEventListener("animationend", resetAnimation);
    });

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    });

    fadeElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        observer.observe(element);
    });

    // Contact Form
    document
        .getElementById("contactForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            const button = this.querySelector(".submit-btn");
            const icon = button.querySelector(".btn-icon");

            // Add loading state
            button.classList.add("loading");

            // Simulate form submission
            setTimeout(() => {
                button.classList.remove("loading");
                button.classList.add("success");
                icon.innerHTML = '<i class="fas fa-check"></i>';

                // Reset form and button after delay
                setTimeout(() => {
                    this.reset();
                    button.classList.remove("success");
                    icon.innerHTML = '<i class="fas fa-paper-plane"></i>';

                    // Shake animation for success feedback
                    button.style.animation = "shake 0.5s ease";
                    setTimeout(() => {
                        button.style.animation = "";
                    }, 500);
                }, 2000);
            }, 1500);
        });

    // Add floating label animation for each input
    document.querySelectorAll(".form-input").forEach((input) => {
        input.addEventListener("focus", () => {
            input.parentElement.classList.add("focused");
        });

        input.addEventListener("blur", () => {
            if (!input.value) {
                input.parentElement.classList.remove("focused");
            }
        });
    });
});
