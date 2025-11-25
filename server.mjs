// server.cjs
import express from "express";
import cors from "cors";
import db from "./db.js"; // your database connection file
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---- TEST ROUTE ----
app.get("/test", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error("Test route error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// ---- REGISTER STUDENT ----
app.post("/students", async (req, res) => {
    try {
        const {
            last_name,
            given_name,
            middle_name,
            extension,
            student_number,
            course_year_section,
            email
        } = req.body;

        const result = await db.query(
            `INSERT INTO students 
                (last_name, given_name, middle_name, extension, student_number, course_year_section, email)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                last_name,
                given_name,
                middle_name,
                extension,
                student_number,
                course_year_section,
                email
            ]
        );

        res.status(201).json({ success: true, student: result.rows[0] });

    } catch (error) {
        console.error("Error inserting student:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// ---- START SERVER ----
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
