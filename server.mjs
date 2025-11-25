import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create student
app.post("/students", async (req, res) => {
  const { lastName, givenName, middleName, extension, studentNumber, course, email } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO students (lastName, givenName, middleName, extension, studentNumber, course, email)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [lastName, givenName, middleName, extension, studentNumber, course, email]
    );
    res.json({ success: true, student: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// Render listens to process.env.PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
