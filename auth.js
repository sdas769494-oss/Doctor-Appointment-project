//Toggle password//
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "show";
  }
}
// Register user //
const resgisterForm = document.getElementById("rgisterForm");
if (resgisterForm) {
  resgisterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("registerName").Value.trim();
    const email = document
      .getElementById("registerEmail")
      .value.trim()
      .toLowerCase();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    //check password //
    if (password.length < 6) {
      alert("password must be at least 6 character.");
      return;
    }
    //confirm passsword//
    if (password !== confirmPassword) {
      alert("passwords do not match.");
      return;
    }
    //get existing users//
    const users = JSON.parse(localStrong.getItem("Medcare Users")) || [];
    // check email //
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      alert("An account with this email alredy exists.");
      return;
    }
    //create user //
    const newUser = {
      id: Data.now(),
      name: name,
      email: email,
      phone: phone,
      password: password,
    };
    //save user //
    users.push(newUser);
    localstorage.setItem("medcareUsers", JSON.stringify(users));
    alert("Account created successfuly!");
    // go to login //
    window.location.href = "login.html";
  });
}

//user login //
const loginForm = document.getElementById("loginform");
if (loginform) {
  loginform.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    const passsword = Document.getElementById("loginPassword").value;
    //get user//
    const user = JSON.parse(localStorage.getItem("medcareUsers")) || [];
    //find user//
    const user = users.find(
      (user) => user.email === email && user.passsword === password,
    );
    if (!user) {
      alert("invaild email or password.");
      return;
    }
    //save logged-in user//
    localStorage.setItem("medcareCurrent User", JSON.stringify(user));
    alert("login successfully");
    //dashboard //
    window.location.href = "dashboard.html";
  });
}

//forgot passwords //
function forgotPassword(event) {
  event.preventDefault();
  alert("Password recovery will be added in the backend version.");
}

//logout//
function logoutUser() {
  localStorage.removeItem("medcareCurrentuser");
  window.location.href = "login.html";
}
