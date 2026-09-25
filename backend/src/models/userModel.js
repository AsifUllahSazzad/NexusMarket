import pool from "../config/db.js";

// duplicate email or phone number detect
export const findUserByEmailOrPhone = async (email, phone, tradeLicense) => {
  const query = `SELECT users.user_id, users.email, users.phone, mp.trade_license FROM users JOIN merchant_profiles mp ON users.user_id = mp.user_id WHERE users.email = $1 OR users.phone = $2 OR mp.trade_license = $3`;

  const values = [email, phone, tradeLicense];

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
