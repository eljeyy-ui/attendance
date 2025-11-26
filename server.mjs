import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Render PORT
const PORT = process.env.PORT || 10000;

// ROOT ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// TEST DATABASE CONNECTIVITY
app.get("/test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET STUDENTS
app.get("/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// POST STUDENT
app.post("/students", async (req, res) => {
  try {
    const {
      last_name,
      given_name,
      middle_name,
      extension,
      student_number,
      year_section,
      email,
      photo
    } = req.body;

    await db.query(
      `INSERT INTO students 
      (last_name, given_name, middle_name, extension, student_number, year_section, email, photo) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [last_name, given_name, middle_name, extension, student_number, year_section, email, photo]
    );

    res.json({ message: "Student saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
