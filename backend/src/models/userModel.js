import pool from "../config/db";

// duplicate email or phone number detect
export const findUserByEmailOrPhone = async (email, phone) => {
  const query = `SELECT user_id FROM users WHERE email = $1 OR phone = $2`;

  const values = [email, phone];

  const result = await pool.query(query, values);

  return result.rows[0];
};
