import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://attendance_db_uzr1_user:wIKmkDBgWl0YAyVo5LiJ2wAWEHvl7GWf@dpg-d4isj4adbo4c73bvm300-a.oregon-postgres.render.com/attendance_db_uzr1",
  ssl: { rejectUnauthorized: false }
});

export default pool;
