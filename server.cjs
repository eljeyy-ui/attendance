require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Use pool from db.js
const pool = require("./db.js");

console.log("RUNNING SERVER...");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Example test route
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Serve frontend
app.use(express.static("public"));

app.listen(process.env.PORT || 4000, () =>
  console.log("Server running on port", process.env.PORT || 4000)
);
