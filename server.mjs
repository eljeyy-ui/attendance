import express from "express";
import cors from "cors";
import db from "./db.js";   // Database connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================
//     TEST ROUTE
// ==========================
app.get("/test", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// ==========================
//     GET ALL STUDENTS
// ==========================
app.get("/students", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM students ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// ==========================
//     CREATE NEW STUDENT
// ==========================
app.post("/students", async (req, res) => {
    const { lastName, givenName, middleName, extension, studentNumber, course, email } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO students (last_name, given_name, middle_name, extension, student_number, course_year_section, email)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [lastName, givenName, middleName, extension, studentNumber, course, email]
        );

        res.status(201).json({ success: true, student: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Insert failed" });
    }
});

// ==========================
//     START SERVER
//     (Render requires process.env.PORT)
// ==========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
