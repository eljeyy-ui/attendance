console.log("DB file loaded!");

import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "attendance_db",
    password: "1234",
    port: 5432
});
