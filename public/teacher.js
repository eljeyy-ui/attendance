let students = [];  
let currentDate = new Date().toISOString().split("T")[0];

// Fetch students from backend
fetch("http://localhost:4000/students")
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

        renderStudentTable(students);
    })
    .catch(err => console.error("Fetch error:", err));

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const teacherDashboard = document.getElementById("teacherDashboard");
const loginContainer = document.querySelector(".login-container");

// LOGIN BUTTON
loginBtn.addEventListener("click", function () {
  const emailInput = document.getElementById("teacherEmail");
  const passwordInput = document.getElementById("teacherPassword");
  const emailError = document.getElementById("teacherEmailError");
  const passwordError = document.getElementById("teacherPasswordError");

  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.classList.remove("input-error-border");
  passwordInput.classList.remove("input-error-border");

  let valid = true;

  if (!emailInput.value.includes("@")) {
    emailError.textContent = "Invalid email. '@' is missing.";
    emailInput.classList.add("input-error-border");
    valid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.textContent = "Password is required";
    passwordInput.classList.add("input-error-border");
    valid = false;
  }

  if (!valid) return;

  loginContainer.style.display = "none";
  teacherDashboard.style.display = "block";
  document.getElementById("attendanceDate").value = currentDate;

  renderStudentTable(students);
});

// RENDER TABLE
function renderStudentTable(studentsToRender) {
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";

  studentsToRender.forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.lastName}, ${student.givenName}</td>
      <td>${student.studentNumber}</td>
      <td>${student.yearSection}</td>
      <td>
        <div class="attendance-options">
          <label><input type="checkbox" class="present-checkbox"> Present</label>
          <label><input type="checkbox" class="absent-checkbox"> Absent</label>
          <div class="absent-extra" style="display:none;">
            <label><input type="checkbox" class="excuse-checkbox"> With Excuse Letter</label>
            <label><input type="checkbox" class="no-excuse-checkbox"> No Excuse</label>
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  setupAttendanceEvents();
}

// FILTERING
function filterStudents() {
  const searchValue = document.getElementById("searchStudent").value.toLowerCase();
  const yearValue = document.getElementById("yearFilter").value;
  const sectionValue = document.getElementById("sectionFilter").value;

  let filtered = students.filter(student => {
    let matchesSearch =
      student.lastName.toLowerCase().includes(searchValue) ||
      student.givenName.toLowerCase().includes(searchValue) ||
      student.studentNumber.toLowerCase().includes(searchValue) ||
      student.yearSection.toLowerCase().includes(searchValue);

    let matchesYear = yearValue === "" || student.yearSection.includes(yearValue);
    let matchesSection = sectionValue === "" || student.yearSection.includes(sectionValue);

    return matchesSearch && matchesYear && matchesSection;
  });

  renderStudentTable(filtered);
}

document.getElementById("searchStudent").addEventListener("input", filterStudents);
document.getElementById("yearFilter").addEventListener("change", filterStudents);
document.getElementById("sectionFilter").addEventListener("change", filterStudents);

// MARK ALL PRESENT
document.getElementById("markAllBtn").addEventListener("click", () => {
  const rows = document.querySelectorAll("#studentsTable tbody tr");

  rows.forEach(row => {
    const present = row.querySelector(".present-checkbox");
    const absent = row.querySelector(".absent-checkbox");
    const extra = row.querySelector(".absent-extra");
    const excuse = row.querySelector(".excuse-checkbox");
    const noExcuse = row.querySelector(".no-excuse-checkbox");

    present.checked = true;
    absent.checked = false;
    extra.style.display = "none";
    excuse.checked = false;
    noExcuse.checked = false;
  });

  alert("All students marked present!");
});

// SAVE ATTENDANCE
document.getElementById("saveAttendanceBtn").addEventListener("click", () => {
  const rows = document.querySelectorAll("#studentsTable tbody tr");
  const date = document.getElementById("attendanceDate").value;
  const subject = document.getElementById("subjectInput").value;

  if (!date || !subject) {
    alert("Please fill out Date and Subject.");
    return;
  }

  let attendance = [];

  rows.forEach((row, index) => {
    const present = row.querySelector(".present-checkbox").checked;
    const absent = row.querySelector(".absent-checkbox").checked;
    const excuse = row.querySelector(".excuse-checkbox").checked;
    const noExcuse = row.querySelector(".no-excuse-checkbox").checked;

    const student = students[index];

    attendance.push({
      student_id: student.id,
      status: present ? "Present" : absent ? "Absent" : "None",
      excuse: excuse ? "With Excuse" : noExcuse ? "No Excuse" : ""
    });
  });

  fetch("http://localhost:4000/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, date, attendance })
  });

  alert("Attendance saved successfully!");
});

// CHECKBOX LOGIC
function setupAttendanceEvents() {
  const rows = document.querySelectorAll("#studentsTable tbody tr");

  rows.forEach(row => {
    const present = row.querySelector(".present-checkbox");
    const absent = row.querySelector(".absent-checkbox");
    const extra = row.querySelector(".absent-extra");
    const excuse = row.querySelector(".excuse-checkbox");
    const noExcuse = row.querySelector(".no-excuse-checkbox");

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
}
