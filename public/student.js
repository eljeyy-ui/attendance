document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");

    studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const requiredFields = [
            { id: "studentLastName", error: "lastNameError", message: "Last Name is required" },
            { id: "studentGivenName", error: "givenNameError", message: "Given Name is required" },
            { id: "studentNumber", error: "studentNumberError", message: "Student Number is required" },
            { id: "yearSection", error: "yearSectionError", message: "Course / Year / Section is required" },
            { id: "studentEmail", error: "emailError", message: "Email is required" }
        ];

        let valid = true;

        // Reset errors
        requiredFields.forEach(f => {
            document.getElementById(f.error).textContent = "";
            document.getElementById(f.id).classList.remove("input-error-border");
        });

        // Validate required fields
        requiredFields.forEach(f => {
            const element = document.getElementById(f.id);
            if (!element.value.trim()) {
                document.getElementById(f.error).textContent = f.message;
                element.classList.add("input-error-border");
                valid = false;
            }
        });

        if (!valid) return;

        // Prepare student object for backend
        const student = {
            last_name: document.getElementById("studentLastName").value.trim(),
            given_name: document.getElementById("studentGivenName").value.trim(),
            middle_name: document.getElementById("studentMiddleName").value.trim(),
            extension: document.getElementById("studentExtension").value.trim(),
            student_number: document.getElementById("studentNumber").value.trim(),
            year_section: document.getElementById("yearSection").value.trim(),
            email: document.getElementById("studentEmail").value.trim()
        };

        // Send student to backend
        try {
            const response = await fetch("http://localhost:4000/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });

            const result = await response.json();

            if (!result.success) {
                alert("Server error: " + result.error);
                return;
            }

            alert("Student registered successfully!");
            studentForm.reset();

        } catch (err) {
            alert("Failed to connect to server. Make sure the backend is running.");

            console.error(err);
        }
    });

    // Remove error border while typing
    studentForm.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("input-error-border");
            const error = input.parentElement.querySelector(".field-error");
            if (error) error.textContent = "";
        });
    });
});
