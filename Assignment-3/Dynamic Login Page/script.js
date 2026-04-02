// LOGIN LOGIC
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = username.value;
    const pass = password.value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("auth", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login credentials");
    }
});

// PROTECT DASHBOARD
if (location.pathname.includes("dashboard.html")) {
    if (!localStorage.getItem("auth")) {
        location.href = "login.html";
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("auth");
    location.href = "login.html";
}
