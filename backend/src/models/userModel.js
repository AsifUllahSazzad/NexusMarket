import pool from "../config/db.js";

// Find an existing account by email or phone
export const findUserByEmailOrPhone = async (email, phone) => {
  const query = `SELECT user_id, email, phone FROM users WHERE email = $1 OR phone = $2 LIMIT 1`;

  const values = [email, phone];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

export const findMerchantByTradeLicense = async (tradeLicense) => {
  const query = `SELECT merchant_id, user_id, trade_license FROM merchant_profiles WHERE trade_license = $1 LIMIT 1;`;

  const value = [tradeLicense];

  const result = await pool.query(query, value);

  return result.rows[0] ?? null;
};

// Insert account authentication data
export const insertUserData = async (
  client,
  full_name,
  email,
  phone,
  password_hash,
  role = "user"
) => {
  const query = ``;

  const values = [full_name, email, phone, password_hash, role];

  const result = await client.query(query, values);

  return result.rows[0];
};

// find login user
export const findLoginUser = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;

  const values = [email];

  const result = await pool.query(query, values);

  return result.rows[0];
};
