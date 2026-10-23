export const createBuyer = async (client, buyerData) => {
  const { fullName, email, mobilePhone, passwordHash, deliveryCity } =
    buyerData;

  // Store the shared user account
  const userResult = await client.query(
    `INSERT INTO users (
         full_name,
         email,
         mobile_phone,
         password_hash,
         role,
         agreement_accepted
       )
       VALUES ($1, $2, $3, $4, 'buyer', TRUE)
       RETURNING id, full_name, email, mobile_phone, role, created_at`,
    [fullName, email, mobilePhone, passwordHash],
  );

  const user = userResult.rows[0];

  // Store the buyer profile
  const profileResult = await client.query(
    `INSERT INTO buyer_profiles(user_id, delivery_city) VALUES($1, $2)
    RETURNING *`,
    [user.id, deliveryCity],
  );

  return {
    user,
    buyerProfile: profileResult.rows[0],
  };
};
