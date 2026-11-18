import pool from "../config/db.js";

export async function createProduct(merchantId, productData) {
  const {
    productName,
    sku,
    imageUrl,
    description,
    category,
    price,
    stockQuantity,
    status,
  } = productData;

  const query = `
    INSERT INTO products (
      merchant_id,
      product_name,
      sku,
      image_url,
      description,
      category,
      price,
      stock_quantity,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    merchantId,
    productName,
    sku,
    imageUrl,
    description || null,
    category,
    price,
    stockQuantity,
    status || "draft",
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}
