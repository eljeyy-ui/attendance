document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");

    if (!studentForm) return;

    studentForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent form default submission

        // Required fields with error containers
        const fields = [
            { input: document.getElementById("studentLastName"), error: document.getElementById("lastNameError"), message: "Last Name is required" },
            { input: document.getElementById("studentGivenName"), error: document.getElementById("givenNameError"), message: "Given Name is required" },
            { input: document.getElementById("studentNumber"), error: document.getElementById("studentNumberError"), message: "Student Number is required" },
            { input: document.getElementById("yearSection"), error: document.getElementById("yearSectionError"), message: "Course / Year / Section is required" },
            { input: document.getElementById("studentEmail"), error: document.getElementById("emailError"), message: "Email is required" }
        ];

        let valid = true;

        // Reset errors
        fields.forEach(f => {
            if (f.error) f.error.textContent = "";
            if (f.input) f.input.classList.remove("input-error-border");
        });

        // Validate fields
        fields.forEach(f => {
            if (!f.input || !f.input.value.trim()) {
                if (f.error) f.error.textContent = f.message;
                if (f.input) f.input.classList.add("input-error-border");
                valid = false;
            }
        });

        if (!valid) return;

        // Prepare data
        const data = {
            last_name: document.getElementById("studentLastName")?.value.trim() || "",
            given_name: document.getElementById("studentGivenName")?.value.trim() || "",
            middle_name: document.getElementById("studentMiddleName")?.value.trim() || null,
            extension: document.getElementById("studentExtension")?.value.trim() || null,
            student_number: document.getElementById("studentNumber")?.value.trim() || "",
            year_section: document.getElementById("yearSection")?.value.trim() || "",
            email: document.getElementById("studentEmail")?.value.trim() || ""
        };

        try {
            const res = await fetch("http://localhost:3000/register-student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.success) {
                alert("Student registration successful!");
                studentForm.reset();
            } else {
                alert("Failed: " + result.error);
            }
        } catch (err) {
            alert("Server error: " + err.message);
        }
    });

    // Remove error when typing
    const inputs = studentForm.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("input-error-border");
            const errorDiv = input.parentElement.querySelector(".field-error");
            if (errorDiv) errorDiv.textContent = "";
        });
    });
});
