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
    const existingUser = users.find(user => user.email === email));
    if (existingUser) {
        alert(An account with this email already exists.");
            return;
    }
  });
}
