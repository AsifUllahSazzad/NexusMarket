import pool from "../config/db.js";

// Find admin by ID
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
    [userId],
  );

  return result.rows[0] ?? null;
}

// Admin Sees Pending Merchant Applications
export async function getPendingApplications(pool) {
  const query = `
    SELECT
      ma.id,
      ma.user_id,
      ma.brand_name,
      ma.primary_product_category,
      ma.status,
      ma.created_at,
      u.full_name,
      u.email,
      u.mobile_phone
    FROM merchant_applications AS ma
    INNER JOIN users AS u
      ON ma.user_id = u.id
    WHERE ma.status = 'pending'
    ORDER BY ma.created_at ASC;
  `;

  const result = await pool.query(query);

  return result.rows;
}

// Approve Merchant Application by Admin
export async function approveMerchantApplication(pool, applicationId, adminId) {
  const query = `
    UPDATE merchant_applications  
    SET
      status = 'approved',
      reviewed_by = $2,
      reviewed_at = NOW(),
      rejection_reason = NULL
    WHERE id = $1
      AND status = 'pending'
    RETURNING id, user_id, brand_name, status, reviewed_by, reviewed_at;
  `;

  const result = await pool.query(query, [applicationId, adminId]);

  return result.rows[0] || null;
}

// Reject Merchant Application by Admin
export async function rejectMerchantApplication(
  pool,
  applicationId,
  adminId,
  reason,
) {
  const query = `
    UPDATE merchant_applications
    SET
      status = 'rejected',
      reviewed_by = $2,
      reviewed_at = NOW(),
      rejection_reason = $3
    WHERE id = $1
      AND status = 'pending'
    RETURNING id, user_id, brand_name, status,
              rejection_reason, reviewed_by, reviewed_at;
  `;

  const result = await pool.query(query, [applicationId, adminId, reason]);

  return result.rows[0] || null;
}
