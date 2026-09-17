// TOGGLE PASSWORD//

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";

    button.textContent = "Hide";
  } else {
    input.type = "password";

    button.textContent = "Show";
  }
}

// REGISTER USER//

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const email = document
      .getElementById("registerEmail")
      .value.trim()
      .toLowerCase();

    const phone = document.getElementById("registerPhone").value.trim();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check password//

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");

      return;
    }

    // Confirm password//

    if (password !== confirmPassword) {
      alert("Passwords do not match.");

      return;
    }

    // Get existing users//

    const users = JSON.parse(localStorage.getItem("medcareUsers")) || [];

    // Check email//

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      alert("An account with this email already exists.");

      return;
    }

    // Create user//

    const newUser = {
      id: Date.now(),

      name: name,

      email: email,

      phone: phone,

      password: password,
    };

    // Save user//

    users.push(newUser);

    localStorage.setItem("medcareUsers", JSON.stringify(users));

    alert("Account created successfully!");

    // Go to login//

    window.location.href = "login.html";
  });
}

// LOGIN USER//

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("loginPassword").value;

    // Get users//

    const users = JSON.parse(localStorage.getItem("medcareUsers")) || [];

    // Find user//

    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!user) {
      alert("Invalid email or password.");

      return;
    }

    // Save logged-in user//

    localStorage.setItem("medcareCurrentUser", JSON.stringify(user));

    alert("Login successful!");

    // Dashboard//

    window.location.href = "dashboard.html";
  });
}

// FORGOT PASSWORD//

function forgotPassword(event) {
  event.preventDefault();

  alert("Password recovery will be added in the backend version.");
}

// LOGOUT//

function logoutUser() {
  localStorage.removeItem("medcareCurrentUser");

  window.location.href = "login.html";
}
