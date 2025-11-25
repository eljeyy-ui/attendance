// Sample student data (25-30 students)
const students = [
    { id: 1, name: "John Smith", number: "S1001", yearSection: "1st Year - Section A", photo: "" },
    { id: 2, name: "Emma Johnson", number: "S1002", yearSection: "1st Year - Section A", photo: "" },
    { id: 3, name: "Michael Brown", number: "S1003", yearSection: "1st Year - Section B", photo: "" },
    { id: 4, name: "Sarah Davis", number: "S1004", yearSection: "1st Year - Section B", photo: "" },
    { id: 5, name: "Robert Wilson", number: "S1005", yearSection: "1st Year - Section C", photo: "" },
    { id: 6, name: "Jennifer Martinez", number: "S1006", yearSection: "2nd Year - Section A", photo: "" },
    { id: 7, name: "Daniel Anderson", number: "S1007", yearSection: "2nd Year - Section A", photo: "" },
    { id: 8, name: "Lisa Thomas", number: "S1008", yearSection: "2nd Year - Section B", photo: "" },
    { id: 9, name: "Mark Taylor", number: "S1009", yearSection: "2nd Year - Section B", photo: "" },
    { id: 10, name: "Amy Garcia", number: "S1010", yearSection: "2nd Year - Section C", photo: "" },
    { id: 11, name: "Kevin Rodriguez", number: "S1011", yearSection: "3rd Year - Section A", photo: "" },
    { id: 12, name: "Laura Hernandez", number: "S1012", yearSection: "3rd Year - Section A", photo: "" },
    { id: 13, name: "James Moore", number: "S1013", yearSection: "3rd Year - Section B", photo: "" },
    { id: 14, name: "Nancy Clark", number: "S1014", yearSection: "3rd Year - Section B", photo: "" },
    { id: 15, name: "Paul Lewis", number: "S1015", yearSection: "3rd Year - Section C", photo: "" },
    { id: 16, name: "Donna Walker", number: "S1016", yearSection: "4th Year - Section A", photo: "" },
    { id: 17, name: "Brian Hall", number: "S1017", yearSection: "4th Year - Section A", photo: "" },
    { id: 18, name: "Michelle Allen", number: "S1018", yearSection: "4th Year - Section B", photo: "" },
    { id: 19, name: "Jason Young", number: "S1019", yearSection: "4th Year - Section B", photo: "" },
    { id: 20, name: "Karen King", number: "S1020", yearSection: "4th Year - Section C", photo: "" },
    { id: 21, name: "Steven Wright", number: "S1021", yearSection: "1st Year - Section A", photo: "" },
    { id: 22, name: "Angela Scott", number: "S1022", yearSection: "1st Year - Section B", photo: "" },
    { id: 23, name: "Timothy Green", number: "S1023", yearSection: "2nd Year - Section A", photo: "" },
    { id: 24, name: "Rebecca Adams", number: "S1024", yearSection: "2nd Year - Section C", photo: "" },
    { id: 25, name: "Christopher Baker", number: "S1025", yearSection: "3rd Year - Section A", photo: "" },
    { id: 26, name: "Jessica Gonzalez", number: "S1026", yearSection: "3rd Year - Section B", photo: "" },
    { id: 27, name: "Joshua Nelson", number: "S1027", yearSection: "4th Year - Section A", photo: "" },
    { id: 28, name: "Amanda Carter", number: "S1028", yearSection: "4th Year - Section B", photo: "" },
    { id: 29, name: "Matthew Mitchell", number: "S1029", yearSection: "1st Year - Section C", photo: "" },
    { id: 30, name: "Melissa Perez", number: "S1030", yearSection: "2nd Year - Section B", photo: "" }
];

// DOM elements
const studentPhoto = document.getElementById('studentPhoto');
const photoPreview = document.getElementById('photoPreview');
const successMessage = document.getElementById('successMessage');

function goBack() {
    window.location.href = 'index.html';
}

// Submit student registration
function submitRegistration() {
    const name = document.getElementById('studentName').value;
    const number = document.getElementById('studentNumber').value;
    const yearSection = document.getElementById('yearSection').value;
    const photoFile = studentPhoto.files[0];
    
    if (!name || !number || !yearSection) {
        alert('Please fill in all required fields');
        return;
    }
    
    let photoData = '';
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoData = e.target.result;
            completeRegistration(name, number, yearSection, photoData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        completeRegistration(name, number, yearSection, '');
    }
}

function completeRegistration(name, number, yearSection, photoData) {
    // Check if student already exists
    let student = students.find(s => s.number === number);
    
    if (student) {
        // Update existing student
        student.name = name;
        student.yearSection = yearSection;
        if (photoData) student.photo = photoData;
    } else {
        // Add new student to the "database"
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        students.push({ 
            id: newId, 
            name, 
            number, 
            yearSection, 
            photo: photoData 
        });
    }
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Wait for 2 seconds then redirect
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("App initialized.");
});
