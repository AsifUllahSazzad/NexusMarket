import pool from "../config/db.js";

// Create Product Data
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

// Get all products belonging to a merchant
export const getMerchantProducts = async (merchantId) => {
  const query = `
    SELECT
      *
    FROM products
    WHERE merchant_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await pool.query(query, [merchantId]);

  return rows;
};

// Get one product belonging to a merchant
export const getProductById = async (productId, merchantId) => {
  const query = `
    SELECT *
    FROM products
    WHERE id = $1
      AND merchant_id = $2
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [productId, merchantId]);

  return rows[0] || null;
};
