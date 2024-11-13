document.addEventListener("DOMContentLoaded", () => {

    const loginSection = document.getElementById("login-section");

    const registerSection = document.getElementById("register-section");

    const taskSection = document.getElementById("task-section");

    const loginForm = document.getElementById("login-form");

    const registerForm = document.getElementById("register-form");

    const taskForm = document.getElementById("task-form");

    const taskList = document.getElementById("task-list");

    const searchInput = document.getElementById("search-bar");

    const priorityFilter = document.getElementById("filter-priority");

    const sortTasks = document.getElementById("sort-tasks");

    const registerLink = document.getElementById("register-link");

    const loginLink = document.getElementById("login-link");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    loginSection.classList.remove("hidden");

    // Switch to Register Section

    registerLink.addEventListener("click", (e) => {

        e.preventDefault();

        loginSection.classList.add("hidden");

        registerSection.classList.remove("hidden");

    });

    // Switch to Login Section

    loginLink.addEventListener("click", (e) => {

        e.preventDefault();

        registerSection.classList.add("hidden");

        loginSection.classList.remove("hidden");

    });

    // Registration Form Submission

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username = document.getElementById("reg-username").value;

        const password = document.getElementById("reg-password").value;

        if (users.find(user => user.username === username)) {

            alert("Username already exists");

        } else {

            users.push({ username, password });

            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful! Please log in.");

            registerSection.classList.add("hidden");

            loginSection.classList.remove("hidden");

        }

    });

    // Login Form Submission

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;

        const password = document.getElementById("password").value;

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {

            localStorage.setItem("currentUser", username);

            loginSection.classList.add("hidden");

            taskSection.classList.remove("hidden");

            renderTasks(); // Call to render tasks once logged in

        } else {

            alert("Invalid credentials");

        }

    });

    // Task Form Submission

    taskForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const title = document.getElementById("task-title").value;

        const description = document.getElementById("task-desc").value;

        const deadline = document.getElementById("task-deadline").value;

        const priority = document.getElementById("task-priority").value;

        const task = {

            id: Date.now(),

            title,

            description,

            deadline,

            priority,

            user: localStorage.getItem("currentUser"),

            completed: false

        };

        tasks.push(task);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Render tasks immediately after adding a new one

        renderTasks();

        // Reset the form after adding the task

        taskForm.reset();

    });

    // Search, Filter, and Sort Functionality

    searchInput.addEventListener("input", renderTasks);

    priorityFilter.addEventListener("change", renderTasks);

    sortTasks.addEventListener("change", renderTasks);

    // Render Tasks

    function renderTasks() {

        taskList.innerHTML = ""; // Clear existing tasks

        const currentUser = localStorage.getItem("currentUser");

        // Filter tasks by the logged-in user

        let filteredTasks = tasks.filter(task => task.user === currentUser);

        // Apply priority filter

        if (priorityFilter.value) {

            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter.value);

        }

        // Apply search filter

        if (searchInput.value) {

            const search = searchInput.value.toLowerCase();

            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));

        }

        // Apply sorting if specified

        if (sortTasks.value === "priority") {

            filteredTasks.sort((a, b) => ["low", "medium", "high"].indexOf(a.priority) - ["low", "medium", "high"].indexOf(b.priority));

        } else if (sortTasks.value === "deadline") {

            filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        }

        // Render the filtered tasks

        filteredTasks.forEach(task => {

            const taskItem = document.createElement("li");

            taskItem.className = "task-item";

            taskItem.innerHTML = `

                <span><strong>${task.title}</strong> - ${task.priority} - ${task.deadline}</span>

                <button onclick="deleteTask(${task.id})">Delete</button>

            `;

            taskList.appendChild(taskItem);

        });

    }

    // Delete Task

    window.deleteTask = (id) => {

        tasks = tasks.filter(task => task.id !== id);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks(); // Re-render the task list after deletion

    };

    // Logout Button

    document.getElementById("logout-button").addEventListener("click", () => {

        localStorage.removeItem("currentUser");

        taskSection.classList.add("hidden");

        loginSection.classList.remove("hidden");

    });

});

