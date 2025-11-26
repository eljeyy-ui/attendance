// student.js
// Uses global window.API_URL (from config.js)

const API = window.API_URL || "https://attendance-87vv.onrender.com";

const form = document.getElementById("studentForm");

function clearErrors(){
  document.querySelectorAll(".input-error").forEach(n => n.textContent = "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const givenName = document.getElementById("studentGivenName").value.trim();
  const lastName = document.getElementById("studentLastName").value.trim();
  const studentNumber = document.getElementById("studentNumber").value.trim();
  const yearSection = document.getElementById("yearSection").value.trim();
  const email = document.getElementById("studentEmail").value.trim();

  let hasError = false;
  if(!givenName){ document.getElementById("givenNameError").textContent = "Required"; hasError=true; }
  if(!lastName){ document.getElementById("lastNameError").textContent = "Required"; hasError=true; }
  if(!studentNumber){ document.getElementById("studentNumberError").textContent = "Required"; hasError=true; }
  if(!yearSection){ document.getElementById("yearSectionError").textContent = "Required"; hasError=true; }
  if(!email){ document.getElementById("emailError").textContent = "Required"; hasError=true; }

  if(hasError) return;

  // server expects snake_case fields (based on server.mjs)
  const payload = {
    last_name: lastName,
    given_name: givenName,
    middle_name: "",
    extension: "",
    student_number: studentNumber,
    year_section: yearSection,
    email: email,
    photo: ""
  };

  try {
    const res = await fetch(`${API}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if(!res.ok){
      alert("Server error: " + (data.error || res.statusText));
      return;
    }

    alert("Student registered!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Network error: failed to reach server. Check API URL or Render service.");
  }
});
