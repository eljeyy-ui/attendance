document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studentForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            program: document.getElementById("program").value,
        };

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Student registered successfully!");
                form.reset();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to connect to server.");
        }
    });
});

