
import pool from '../config/db.js';

export async function findAdminById(userId) {
  const result = await pool.query(
    `SELECT
       id,
       full_name,
       email,
       mobile_phone,
       role,
       created_at
     FROM users
     WHERE id = $1
       AND role = 'admin'`,
    [userId]
  );

  return result.rows[0] ?? null;
}
