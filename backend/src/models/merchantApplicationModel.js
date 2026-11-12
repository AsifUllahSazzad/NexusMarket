export const createMerchantApplication = async (
  client,
  name,
  storeName,
  email,
  phone,
  category,
  tradeLicense,
  passwordHash,
) => {
  // Normalize input values
  const nameNormalization = name.trim();
  const storeNameNormalization = storeName.trim();
  const emailNormalization = email.trim().toLowerCase();
  const phoneNormalization = phone.trim();
  const categoryNormalization = category.trim();
  const tradeLicenseNormalization = tradeLicense.trim();

  // Create the new merchant account
  const userQuery = `
    INSERT INTO users (
      full_name,
      email,
      mobile_phone,
      password_hash,
      role,
      agreement_accepted
    )
    VALUES ($1, $2, $3, $4, 'merchant', TRUE)
    RETURNING
      id,
      full_name,
      email,
      mobile_phone,
      role,
      created_at;
  `;

  const userResult = await client.query(userQuery, [
    nameNormalization,
    emailNormalization,
    phoneNormalization,
    passwordHash,
  ]);

  const user = userResult.rows[0];

  // Create the merchant application
  const applicationQuery = `
    INSERT INTO merchant_applications (
      user_id,
      brand_name,
      primary_product_category,
      trade_license_code
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      user_id,
      brand_name,
      primary_product_category,
      status,
      created_at;
  `;

  const applicationResult = await client.query(applicationQuery, [
    user.id,
    storeNameNormalization,
    categoryNormalization,
    tradeLicenseNormalization,
  ]);

  return {
    user,
    application: applicationResult.rows[0],
  };
};

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
