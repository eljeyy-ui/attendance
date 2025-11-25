document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        last_name: document.getElementById("studentLastName").value,
        given_name: document.getElementById("studentGivenName").value,
        middle_name: document.getElementById("studentMiddleName").value,
        extension: document.getElementById("studentExtension").value,
        student_number: document.getElementById("studentNumber").value,
        year_section: document.getElementById("yearSection").value,
        email: document.getElementById("studentEmail").value
    };

    try {
        const response = await fetch(`${window.API_URL}/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (result.success) {
            alert("Student registered successfully!");
            document.getElementById("studentForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        alert("Failed to connect to server. Make sure the backend is running.");
    }
});

