// insert customer information
export const insertCustomerProfile = async (client, user_id) => {
  const query = `INSERT INTO buyer_profiles(user_id, created_at) VALUES($1, DEFAULT)
   RETURNING buyer_id, user_id, created_at;`;

  const values = [user_id];

  const result = await client.query(query, values);

  return result.rows[0];
};
