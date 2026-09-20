// ADMIN LOGIN//

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
      .getElementById("adminEmail")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("adminPassword").value;

    // Demo admin credentials

    const adminEmail = "admin@medcare.com";

    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("medcareAdminLoggedIn", "true");

      alert("Admin login successful!");

      window.location.href = "admin-dashboard.html";
    } else {
      alert("Invalid admin email or password.");
    }
  });
}

// ADMIN DASHBOARD CHECK //

if (window.location.pathname.includes("admin-dashboard.html")) {
  const adminLoggedIn = localStorage.getItem("medcareAdminLoggedIn");

  if (adminLoggedIn !== "true") {
    window.location.href = "admin-login.html";
  }
}

// GET APPOINTMENTS //

function getAppointments() {
  return JSON.parse(localStorage.getItem("medcareAppointments")) || [];
}
// DISPLAY DASHBOARD //

function loadAdminDashboard() {
  const appointments = getAppointments();

  // Statistics

  const total = appointments.length;

  const pending = appointments.filter(
    (appointment) => appointment.status === "Pending",
  ).length;

  const confirmed = appointments.filter(
    (appointment) => appointment.status === "Confirmed",
  ).length;

  const rejected = appointments.filter(
    (appointment) => appointment.status === "Rejected",
  ).length;

  // Update statistics //

  const totalElement = document.getElementById("totalAppointments");

  const pendingElement = document.getElementById("pendingAppointments");

  const confirmedElement = document.getElementById("confirmedAppointments");

  const rejectedElement = document.getElementById("rejectedAppointments");

  if (totalElement) totalElement.textContent = total;

  if (pendingElement) pendingElement.textContent = pending;

  if (confirmedElement) confirmedElement.textContent = confirmed;

  if (rejectedElement) rejectedElement.textContent = rejected;

  // Display table

  renderAppointments(appointments);
}

// RENDER APPOINTMENTS //

function renderAppointments(appointments) {
  const tableBody = document.getElementById("appointmentTableBody");

  const emptyMessage = document.getElementById("emptyAppointments");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (appointments.length === 0) {
    if (emptyMessage) emptyMessage.style.display = "block";

    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");

    row.innerHTML = `

                <td>

                    <div class="patient-cell">

                        <div class="patient-avatar">
                            ${getInitial(appointment.patientName)}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(appointment.patientName)}
                            </strong>

                            <small>
                                Patient
                            </small>

                        </div>

                    </div>

                </td>

                <td>

                    <div class="contact-cell">

                        <span>
                            ${escapeHTML(appointment.phone)}
                        </span>

                        <small>
                            ${escapeHTML(appointment.email)}
                        </small>

                    </div>
                </td>

                <td>
                    ${formatDate(appointment.date)}
                </td>
                <td>
                    ${escapeHTML(appointment.time)}
                </td>
                <td>
                    <span
                        class="reason-text"
                        title="${escapeHTML(appointment.reason)}">

                        ${escapeHTML(appointment.reason)}

                    </span>
                </td>

                <td>

                    <span
                        class="status-badge
                        ${appointment.status.toLowerCase()}">

                        ${appointment.status}

                    </span>

                </td>

                <td>
                    <div class="action-buttons">

                        ${
                          appointment.status === "Pending"
                            ? `
                            <button
                                class="action-confirm"
                                onclick="updateStatus(
                                    ${appointment.id},
                                    'Confirmed'
                                )">

                                ✓

                            </button>
                            <button
                                class="action-reject"
                                onclick="updateStatus(
                                    ${appointment.id},
                                    'Rejected'
                                )">

                                ✕

                            </button>

                            `
                            : ""
                        }
                        <button
                            class="action-delete"
                            onclick="deleteAppointment(
                                ${appointment.id}
                            )">

                            🗑️

                        </button>

                    </div>

                </td>

            `;
    tableBody.appendChild(row);
  });
}

// UPDATE STATUS //

function updateStatus(appointmentId, newStatus) {
  const appointments = getAppointments();

  const appointment = appointments.find((item) => item.id === appointmentId);

  if (!appointment) return;

  appointment.status = newStatus;

  localStorage.setItem("medcareAppointments", JSON.stringify(appointments));

  loadAdminDashboard();
}

// DELETE APPOINTMENT //

function deleteAppointment(appointmentId) {
  const confirmDelete = confirm("Delete this appointment?");

  if (!confirmDelete) return;

  let appointments = getAppointments();

  appointments = appointments.filter(
    (appointment) => appointment.id !== appointmentId,
  );

  localStorage.setItem("medcareAppointments", JSON.stringify(appointments));

  loadAdminDashboard();
}
// CLEAR ALL //

function clearAllAppointments() {
  const appointments = getAppointments();

  if (appointments.length === 0) {
    alert("There are no appointments to clear.");

    return;
  }

  const confirmClear = confirm(
    "Are you sure you want to delete all appointments?",
  );

  if (!confirmClear) return;

  localStorage.removeItem("medcareAppointments");

  loadAdminDashboard();
}

// ADMIN LOGOUT //

function adminLogout() {
  localStorage.removeItem("medcareAdminLoggedIn");

  window.location.href = "admin-login.html";
}

// HELPER FUNCTIONS //

function getInitial(name) {
  if (!name) return "?";

  return name.charAt(0).toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Basic HTML escaping //

function escapeHTML(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// LOAD DASHBOARD//

if (document.getElementById("appointmentTableBody")) {
  loadAdminDashboard();
}
