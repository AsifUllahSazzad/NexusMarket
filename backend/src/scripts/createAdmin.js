import "../config/env.js"; // must be first
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const phone = process.env.ADMIN_PHONE;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !phone || !password) {
    throw new Error("Missing admin environment variables.");
  }

  if (password.length < 12) {
    throw new Error("Admin password must be at least 12 characters.");
  }

  try {
    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingAdmin.rowCount > 0) {
      throw new Error("This email already exists. No account was changed.");
    }

    const passwordHash = await bcrypt.hash(password, 15);

    const result = await pool.query(
      `INSERT INTO users (
        full_name,
        email,
        mobile_phone,
        password_hash,
        role,
        agreement_accepted,
        agreement_accepted_at
      )
      VALUES ($1, $2, $3, $4, 'admin', TRUE, NOW())
      RETURNING id, full_name, email, mobile_phone, role, created_at`,
      [name, email, phone, passwordHash],
    );

    console.log("Admin created successfully:");
    console.table(result.rows[0]);
  } finally {
    await pool.end();
  }
};

createAdmin().catch((error) => {
  console.error("Admin creation failed:", error.message);
  process.exitCode = 1;
});``
