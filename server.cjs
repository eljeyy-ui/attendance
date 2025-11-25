require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


const pool = require("./db.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");


console.log("RUNNING SERVER...");

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());   // IMPORTANT — FIXES EMPTY req.body

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));
console.log("STATIC PATH:", path.join(__dirname, "public"));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Attendance Backend Running");
});

// Register student
app.post("/students", async (req, res) => {
    try {
        console.log("Received student:", req.body);   // DEBUG LOG

        const {
            last_name,
            given_name,
            middle_name,
            extension,
            student_number,
            year_section,
            email
        } = req.body;

        const result = await pool.query(
            `INSERT INTO students
            (last_name, given_name, middle_name, extension, student_number, year_section, email)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING id`,
            [
                last_name,
                given_name,
                middle_name,
                extension,
                student_number,
                year_section,
                email
            ]
        );

        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error("Error inserting student:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all students
app.get("/students", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM students ORDER BY last_name`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Save attendance
app.post("/attendance", async (req, res) => {
    try {
        const { subject, date, attendance } = req.body;

        for (const row of attendance) {
            await pool.query(
                `INSERT INTO attendance (student_id, subject, date, status, excuse)
                 VALUES ($1, $2, $3, $4, $5)`,
                [row.student_id, subject, date, row.status, row.excuse]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Attendance error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
