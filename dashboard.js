// PATIENT DASHBOARD //

const currentUser = JSON.parse(localStorage.getItem("medcareCurrentUser"));

// CHECK LOGIN //

if (!currentUser) {
  window.location.href = "login.html";
}
// LOAD DASHBOARD //

document.addEventListener("DOMContentLoaded", () => {
  if (!currentUser) return;

  loadPatientProfile();
  loadAppointments();
});

// PROFILE //

function loadPatientProfile() {
  const patientName = document.getElementById("patientName");

  const profileName = document.getElementById("profileName");

  const profileEmail = document.getElementById("profileEmail");

  const profilePhone = document.getElementById("profilePhone");

  const profileAvatar = document.getElementById("profileAvatar");

  if (patientName) {
    patientName.textContent = currentUser.name;
  }

  if (profileName) {
    profileName.textContent = currentUser.name;
  }

  if (profileEmail) {
    profileEmail.textContent = currentUser.email;
  }

  if (profilePhone) {
    profilePhone.textContent = currentUser.phone;
  }

  if (profileAvatar) {
    profileAvatar.textContent = getInitial(currentUser.name);
  }
}

// LOAD APPOINTMENTS //

function loadAppointments() {
  const allAppointments =
    JSON.parse(localStorage.getItem("medcareAppointments")) || [];

  // Only current patient's appointments
  const patientAppointments = allAppointments.filter(
    (appointment) => appointment.email === currentUser.email,
  );

  updateStatistics(patientAppointments);

  showUpcomingAppointment(patientAppointments);

  showAppointmentHistory(patientAppointments);
}

// STATISTICS //

function updateStatistics(appointments) {
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

  document.getElementById("totalAppointments").textContent = total;

  document.getElementById("pendingAppointments").textContent = pending;

  document.getElementById("confirmedAppointments").textContent = confirmed;

  document.getElementById("rejectedAppointments").textContent = rejected;
}

// UPCOMING APPOINTMENT //

function showUpcomingAppointment(appointments) {
  const container = document.getElementById("upcomingAppointment");

  if (!appointments.length) {
    container.innerHTML = `
            <div class="upcoming-empty">
                <div>📅</div>

                <h3>No upcoming appointment</h3>

                <p>
                    Book an appointment with
                    Dr. Debanjana.
                </p>

                <a href="appointment.html">
                    Book Appointment
                </a>
            </div>
        `;

    return;
  }

  // Only future/current appointments //
  const today = new Date().toISOString().split("T")[0];

  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.date >= today &&
        appointment.status !== "Rejected" &&
        appointment.status !== "Cancelled",
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
            <div class="upcoming-empty">
                <div>📅</div>

                <h3>No upcoming appointment</h3>

                <p>
                    You can book a new appointment anytime.
                </p>

                <a href="appointment.html">
                    Book Appointment
                </a>
            </div>
        `;

    return;
  }

  const appointment = upcoming[0];

  container.innerHTML = `

        <div class="upcoming-card">

            <div class="upcoming-doctor">

                <div class="doctor-small-avatar">
                    D
                </div>

                <div>
                    <h3>
                        ${escapeHTML(appointment.doctor)}
                    </h3>

                    <p>
                        Medical Consultation
                    </p>
                </div>

            </div>


            <div class="upcoming-info">

                <div>
                    <span>Date</span>
                    <strong>
                        ${formatDate(appointment.date)}
                    </strong>
                </div>

                <div>
                    <span>Time</span>
                    <strong>
                        ${escapeHTML(appointment.time)}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    ${getStatusBadge(appointment.status)}
                </div>

            </div>

        </div>
    `;
}

// APPOINTMENT HISTORY //

function showAppointmentHistory(appointments) {
  const tableBody = document.getElementById("appointmentHistoryBody");

  const emptyState = document.getElementById("noAppointments");

  if (!appointments.length) {
    tableBody.innerHTML = "";

    emptyState.style.display = "block";

    return;
  }

  emptyState.style.display = "none";

  // Newest first
  appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  tableBody.innerHTML = appointments
    .map((appointment) => {
      const canCancel = appointment.status === "Pending";

      return `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(appointment.doctor)}
                        </strong>
                    </td>

                    <td>
                        ${formatDate(appointment.date)}
                    </td>

                    <td>
                        ${escapeHTML(appointment.time)}
                    </td>

                    <td>
                        ${escapeHTML(appointment.reason).substring(0, 35)}
                        ${appointment.reason.length > 35 ? "..." : ""}
                    </td>

                    <td>
                        ${getStatusBadge(appointment.status)}
                    </td>

                    <td>

                        ${
                          canCancel ? (
                            `
                            <button
                                class="cancel-appointment-btn"
                                onclick="cancelAppointment(${appointment.id})"
                            >
                                Cancel
                            </button>
                            `
                          ) : (
                            <span class="no-action">—</span>
                          )
                        }

                    </td>

                </tr>

            `;
    })
    .join("");
}

// CANCEL APPOINTMENT //

function cancelAppointment(id) {
  const confirmCancel = confirm(
    "Are you sure you want to cancel this appointment?",
  );

  if (!confirmCancel) {
    return;
  }

  let appointments =
    JSON.parse(localStorage.getItem("medcareAppointments")) || [];

  appointments = appointments.map((appointment) => {
    if (appointment.id === id) {
      return {
        ...appointment,
        status: "Cancelled",
      };
    }

    return appointment;
  });

  localStorage.setItem("medcareAppointments", JSON.stringify(appointments));

  alert("Appointment cancelled successfully.");

  loadAppointments();
}

// STATUS BADGE //

function getStatusBadge(status) {
  const statusClass = status.toLowerCase();

  return `
        <span class="patient-status ${statusClass}">
            ${escapeHTML(status)}
        </span>
    `;
}

// FORMAT DATE //

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// GET INITIAL //

function getInitial(name) {
  if (!name) {
    return "P";
  }

  return name.trim().charAt(0).toUpperCase();
}

// SECURITY HELPER //

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
