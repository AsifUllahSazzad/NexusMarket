import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { createMerchantApplication } from "../models/merchantApplicationModel.js";

export const registerMerchant = async (req, res, next) => {
  const {
    name,
    storeName,
    email,
    phone,
    category,
    tradeLicense,
    password,
    agreed,
  } = req.body;

  // Check agreement acceptance
  if (agreed !== true) {
    return res.status(400).json({
      success: false,
      message: "You must accept the agreement to register.",
    });
  }

  let client;
  let transactionStarted = false;

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get PostgreSQL connection
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");
    transactionStarted = true;

    // Create merchant and application
    const result = await createMerchantApplication(
      client,
      name,
      storeName,
      email,
      phone,
      category,
      tradeLicense,
      passwordHash,
    );

    // Save both inserts
    await client.query("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      success: true,
      message:
        "Merchant registered successfully. Your application is pending admin review.",
      data: result,
    });
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
    }

    // Duplicate email
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    return next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};
