let students = [];  
let currentDate = new Date().toISOString().split("T")[0];

// Fetch students from backend (fixed for Render)
fetch(`${API_URL}/students`)
    .then(res => res.json())
    .then(data => {
        students = data.map(s => ({
            lastName: s.last_name,
            givenName: s.given_name,
            middleName: s.middle_name,
            extension: s.extension,
            studentNumber: s.student_number,
            yearSection: s.year_section,
            email: s.email
        }));

        const tableBody = document.querySelector("#studentTable tbody");
        tableBody.innerHTML = "";

        students.forEach((student, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.lastName}</td>
                <td>${student.givenName}</td>
                <td>${student.middleName}</td>
                <td>${student.extension}</td>
                <td>${student.studentNumber}</td>
                <td>${student.yearSection}</td>
                <td>${student.email}</td>
                <td>
                    <label><input type="radio" name="status-${index}" value="present"> Present</label>
                    <label><input type="radio" name="status-${index}" value="absent"> Absent</label>
                </td>
                <td>
                    <div class="extra-options" id="extra-${index}" style="display:none;">
                        <label><input type="radio" name="reason-${index}" value="excuse"> With Excuse</label>
                        <label><input type="radio" name="reason-${index}" value="no-excuse"> Without Excuse</label>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);

            const present = row.querySelector(`input[value="present"]`);
            const absent = row.querySelector(`input[value="absent"]`);
            const extra = row.querySelector(`#extra-${index}`);
            const excuse = row.querySelector(`input[value="excuse"]`);
            const noExcuse = row.querySelector(`input[value="no-excuse"]`);

            present.addEventListener("change", () => {
                if (present.checked) {
                    absent.checked = false;
                    extra.style.display = "none";
                    excuse.checked = false;
                    noExcuse.checked = false;
                }
            });

            absent.addEventListener("change", () => {
                if (absent.checked) {
                    present.checked = false;
                    extra.style.display = "block";
                } else {
                    extra.style.display = "none";
                    excuse.checked = false;
                    noExcuse.checked = false;
                }
            });
        });
    })
    .catch(err => console.error("Error loading students:", err));
