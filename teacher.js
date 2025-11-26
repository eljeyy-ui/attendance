// teacher.js
const API = window.API_URL || "https://attendance-87vv.onrender.com";

const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("teacherDashboard");
const loginBtn = document.getElementById("loginBtn");
const markAllBtn = document.getElementById("markAllBtn");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");
const studentsTableBody = document.querySelector("#studentsTable tbody");
const subjectInput = document.getElementById("subjectInput");
const attendanceDateInput = document.getElementById("attendanceDate");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("teacherEmail").value.trim();
  const password = document.getElementById("teacherPassword").value.trim();

  if (!email || !email.includes("@") || password !== "admin123" || email !== "admin@gmail.com"){
    alert("Invalid login credentials.");
    return;
  }

  // show dashboard
  loginContainer.style.display = "none";
  dashboard.style.display = "block";

  await loadStudents();
});

async function loadStudents(){
  studentsTableBody.innerHTML = "";
  try {
    const res = await fetch(`${API}/students`);
    if(!res.ok){
      const d = await res.json().catch(()=>({}));
      throw new Error(d.error || res.statusText || "Failed to fetch");
    }
    const students = await res.json();

    if(!Array.isArray(students) || students.length === 0){
      studentsTableBody.innerHTML = "<tr><td colspan='4' class='small'>No students found</td></tr>";
      return;
    }

    students.forEach(s => {
      const tr = document.createElement("tr");
      tr.dataset.studentId = s.id || "";
      const name = `${s.given_name || ""} ${s.last_name || ""}`.trim();
      const year = s.year_section || s.course || "";

      tr.innerHTML = `
        <td>${name}</td>
        <td>${s.student_number || ""}</td>
        <td>${year}</td>
        <td>
          <select class="attendance-select">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </td>
      `;
      studentsTableBody.appendChild(tr);
    });

  } catch (err){
    console.error(err);
    alert("Failed to load students: " + err.message);
  }
}

markAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".attendance-select").forEach(sel => sel.value = "Present");
});

saveAttendanceBtn.addEventListener("click", async () => {
  const subject = subjectInput.value.trim();
  const date = attendanceDateInput.value;
  if(!subject || !date){
    alert("Please enter subject and date.");
    return;
  }

  const attendance = [];
  document.querySelectorAll("#studentsTable tbody tr").forEach(tr => {
    const id = tr.dataset.studentId;
    const select = tr.querySelector(".attendance-select");
    const status = select ? select.value : "Absent";
    attendance.push({ student_id: id, status });
  });

  const payload = {
    subject,
    date,
    attendance
  };

  try {
    const res = await fetch(`${API}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      const d = await res.json().catch(()=>({}));
      throw new Error(d.error || res.statusText || "Server returned error");
    }

    alert("Attendance saved!");
  } catch (err) {
    console.error(err);
    alert("Unable to save attendance: " + (err.message || "server error"));
  }
});
