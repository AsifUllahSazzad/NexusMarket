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
      trade_license_code,
      status
    )
    VALUES ($1, $2, $3, $4, 'pending')
    RETURNING
       id AS application_id,
      user_id,
      brand_name,
      primary_product_category,
      trade_license_code,
      status,
      created_at;
  `;

  const applicationResult = await client.query(applicationQuery, [
    user.id,
    storeNameNormalization,
    categoryNormalization,
    tradeLicenseNormalization,
  ]);

  const application = applicationResult.rows[0];

  // 3. Return both database records
  return {
    user,
    application,
  };
};

// Get Merchant Application by User ID
export const getMerchantApplicationByUserId = async (userId, pool) => {
  const query = `
    SELECT
      ma.id AS application_id,
      ma.user_id,

      u.full_name AS owner_name,
      u.email,
      u.mobile_phone AS phone,
      u.created_at AS registered_at,

      ma.brand_name AS store_name,
      ma.primary_product_category AS category,
      ma.trade_license_code AS trade_license,

      ma.status,
      ma.created_at AS submitted_at,
      ma.rejection_reason

    FROM merchant_applications ma

    INNER JOIN users u
      ON ma.user_id = u.id

    WHERE ma.user_id = $1

    ORDER BY ma.created_at DESC
    LIMIT 1;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

// Resubmit Merchant Application
export const resubmitMerchantApplication = async (
  userId,
  applicationId,
  pool,
  payload,
) => {
  const client = await pool.connect();

  try {
    // 1. Start transaction
    await client.query("BEGIN");

    // 2. Find application and verify ownership
    const applicationResult = await client.query(
      `
        SELECT
          ma.id,
          ma.user_id,
          ma.status,
          u.full_name,
          u.mobile_phone
        FROM merchant_applications ma
        JOIN users u ON u.id = ma.user_id
        WHERE ma.id = $1
          AND ma.user_id = $2
        FOR UPDATE OF ma
      `,
      [applicationId, userId],
    );

    if (applicationResult.rows.length === 0) {
      const error = new Error("Merchant application not found.");
      error.statusCode = 404;
      throw error;
    }

    const application = applicationResult.rows[0];

    // 3. Only rejected applications can be resubmitted
    if (application.status !== "rejected") {
      const error = new Error("Only rejected applications can be resubmitted.");
      error.statusCode = 400;
      throw error;
    }

    // 4. Calculate next submission version
    const versionResult = await client.query(
      `
        SELECT COALESCE(MAX(version), 0) + 1 AS next_version
        FROM merchant_application_submissions
        WHERE application_id = $1
      `,
      [applicationId],
    );

    const nextVersion = versionResult.rows[0].next_version;

    // 5. Insert new submission history
    await client.query(
      `
        INSERT INTO merchant_application_submissions (
          application_id,
          version,
          owner_name,
          brand_name,
          primary_product_category,
          trade_license_code,
          mobile_phone,
          compliance_note
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        applicationId,
        nextVersion,
        payload.ownerName,
        payload.storeName,
        payload.category,
        payload.tradeLicense,
        payload.phone,
        payload.complianceNote || null,
      ],
    );

    // 6. Update the current application
    await client.query(
      `
        UPDATE merchant_applications
        SET
          brand_name = $1,
          primary_product_category = $2,
          trade_license_code = $3,
          status = 'pending',
          reviewed_by = NULL,
          reviewed_at = NULL,
          rejection_reason = NULL
        WHERE id = $4
          AND user_id = $5
      `,
      [
        payload.storeName,
        payload.category,
        payload.tradeLicense,
        applicationId,
        userId,
      ],
    );

    // 7. Get the updated application
    const updatedResult = await client.query(
      `
        SELECT
          ma.id AS application_id,
          ma.user_id,
          u.full_name AS owner_name,
          ma.brand_name AS store_name,
          ma.primary_product_category AS category,
          ma.trade_license_code AS trade_license,
          u.mobile_phone AS phone,
          ma.status,
          ma.rejection_reason,
          ma.reviewed_at,
          ma.created_at
        FROM merchant_applications ma
        JOIN users u ON u.id = ma.user_id
        WHERE ma.id = $1
      `,
      [applicationId],
    );

    // 8. Commit transaction
    await client.query("COMMIT");

    return {
      application: updatedResult.rows[0],
      version: nextVersion,
    };
  } catch (error) {
    // Roll back if anything fails
    await client.query("ROLLBACK");

    throw error;
  } finally {
    // Always release database connection
    client.release();
  }
};
