
// CHECK USER LOGIN

const currentUser =
    JSON.parse(
        localStorage.getItem("medcareCurrentUser")
    );


if (!currentUser) {

    window.location.href = "login.html";

}



// AUTO FILL PATIENT DETAILS


const patientName =
    document.getElementById("patientName");

const patientPhone =
    document.getElementById("patientPhone");


if (currentUser) {

    patientName.value =
        currentUser.name || "";

    patientPhone.value =
        currentUser.phone || "";

}


// SET MINIMUM DATE

const appointmentDate =
    document.getElementById("appointmentDate");


const today =
    new Date().toISOString().split("T")[0];


appointmentDate.min = today;



// TIME SLOT SELECTION

const timeSlots =
    document.querySelectorAll(".time-slot");


const selectedTime =
    document.getElementById("selectedTime");


timeSlots.forEach(slot => {

    slot.addEventListener("click", function () {


        // Remove selected class

        timeSlots.forEach(item => {

            item.classList.remove("selected");

        });


        // Select clicked slot

        this.classList.add("selected");


        // Store time

        selectedTime.value =
            this.dataset.time;

    });

});



// APPOINTMENT FORM

const appointmentForm =
    document.getElementById("appointmentForm");


appointmentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Check time

        if (!selectedTime.value) {

            alert(
                "Please select an appointment time."
            );

            return;
        }



        // Get form values

        const name =
            patientName.value.trim();

        const phone =
            patientPhone.value.trim();

        const date =
            appointmentDate.value;

        const time =
            selectedTime.value;

        const reason =
            document
                .getElementById("appointmentReason")
                .value
                .trim();

        // CREATE APPOINTMENT

        const appointment = {

            id: Date.now(),

            doctor:
                "Dr. Debanjana",

            patientName:
                name,

            phone:
                phone,

            email:
                currentUser.email,

            date:
                date,

            time:
                time,

            reason:
                reason,

            status:
                "Pending",

            createdAt:
                new Date().toISOString()

        };


        // GET OLD APPOINTMENT

        const appointments =
            JSON.parse(
                localStorage.getItem(
                    "medcareAppointments"
                )
            ) || [];

=
        // SAVE APPOINTMENT

        appointments.push(
            appointment
        );


        localStorage.setItem(
            "medcareAppointments",
            JSON.stringify(
                appointments
            )
        );
=
        // SUCCESS
        

        alert(
            "Appointment request submitted successfully!"
        );


        // Go dashboard

        window.location.href =
            "dashboard.html";

    }
);