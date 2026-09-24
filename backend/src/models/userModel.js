import pool from "../config/db.js";

// duplicate email or phone number detect
export const findUserByEmailOrPhone = async (email, phone) => {
  const query = `SELECT user_id, email, phone FROM users WHERE email = $1 OR phone = $2`;

  const values = [email, phone];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// insert authentication data
export const insertUserData = async (
  client,
  full_name,
  email,
  phone,
  password_hash,
  role,
) => {
  const query = `INSERT INTO users(full_name, email, phone, password_hash, role, is_active, created_at, updated_at) VALUES($1, $2, $3, $4, $5, DEFAULT, DEFAULT, DEFAULT)
  RETURNING user_id, full_name, email, phone, role, is_active`;

  const values = [full_name, email, phone, password_hash, role];

  const result = await client.query(query, values);

  return result.rows[0];
};
