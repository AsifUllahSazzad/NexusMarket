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
    description,
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

// Update Product Status
export const updateMerchantProductStatus = async (
  userId,
  productId,
  status,
) => {
  const query = `
    UPDATE products
    SET
      status = $1,
      updated_at = NOW()
    WHERE
      id = $2
      AND merchant_id = $3
    RETURNING
      id,
      merchant_id AS "merchantId",
      status,
      updated_at AS "updatedAt";
  `;

  const values = [status, productId, userId];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};


// Update Product Stock
export const updateMerchantProductStock = async (
  userId,
  productId,
  change,
) => {
  const query = `
    UPDATE products
    SET
      stock_quantity = stock_quantity + $1,
      updated_at = NOW()
    WHERE
      id = $2
      AND merchant_id = $3
      AND stock_quantity + $1 >= 0
    RETURNING
      id,
      merchant_id AS "merchantId",
      stock_quantity AS "stockQuantity",
      updated_at AS "updatedAt";
  `;

  const values = [change, productId, userId];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};


// Get one product belonging to a merchant -> Not use
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
