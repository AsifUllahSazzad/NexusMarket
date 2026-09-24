// insert merchant information
export const insertMerchantProfile = async (
  client,
  user_id,
  brandName,
  tradeLicense,
  category,
) => {
  const query = `INSERT INTO merchant_profiles(user_id, studio_or_brand_name, trade_license, category, created_at, updated_at) VALUES($1, $2, $3, $4, DEFAULT, DEFAULT)
   RETURNING merchant_id, user_id, studio_or_brand_name, trade_license, category, created_at, updated_at;`;

  const values = [user_id, brandName, tradeLicense, category];

  const result = await client.query(query, values);

  return result.rows[0];
};
