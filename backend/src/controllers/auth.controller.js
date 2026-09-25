import pool from "../config/db.js";
import { insertCustomerProfile } from "../models/customerModel.js";
import { insertMerchantProfile } from "../models/merchantModel.js";
import { findUserByEmailOrPhone, insertUserData } from "../models/userModel.js";
import bcrypt from "bcrypt";

// Register
export const postMerchant = async (req, res) => {
  const client = await pool.connect();
  try {
    const merchantRegisterData = req.body;

    const { name, email, phone, password, storeName, category, tradeLicense } =
      merchantRegisterData;

    console.log("Merchant Success: ", merchantRegisterData);

    // check user exist
    const existingUser = await findUserByEmailOrPhone(email, phone);

    if (existingUser) {
      const errors = {};

      if (existingUser.email === email) {
        errors.email = "Email is already registered";
      }

      if (existingUser.phone === phone) {
        errors.phone = "Phone number is already registered";
      }

      return res.status(409).json({
        success: false,
        errors,
      });
    }

    // start transaction
    await client.query("BEGIN");

    // password hashing+salt:
    const hashedPassword = await bcrypt.hash(password, 15);

    // insert authentication data:
    const authenticationData = await insertUserData(
      client,
      name,
      email,
      phone,
      hashedPassword,
      "merchant",
    );

    // insert merchant information:
    const result = await insertMerchantProfile(
      client,
      authenticationData.user_id,
      storeName,
      tradeLicense,
      category,
    );

    // Everything succeeded
    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Merchant registered successfully",
      result,
    });
  } catch (error) {
    // Something failed
    await client.query("ROLLBACK");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    // Return connection to pool
    client.release();
  }
};

export const postCustomer = async (req, res) => {
  const client = await pool.connect();
  try {
    const customerRegisterData = await req.body;

    const { name, email, phone, password } = customerRegisterData;

    console.log("Customer Success: ", customerRegisterData);

    // check user exist
    const existingUser = await findUserByEmailOrPhone(email, phone);

    if (existingUser) {
      const errors = {};

      if (existingUser.email === email) {
        errors.email = "Email is already registered";
      }

      if (existingUser.phone === phone) {
        errors.phone = "Phone number is already registered";
      }

      return res.status(409).json({
        success: false,
        errors,
      });
    }

    // start transaction
    await client.query("BEGIN");

    // password hashing+salt:
    const hashedPassword = await bcrypt.hash(password, 15);

    // insert user data:
    const authenticationData = await insertUserData(
      client,
      name,
      email,
      phone,
      hashedPassword,
      "buyer",
    );

    // insert customer information
    const result = await insertCustomerProfile(
      client,
      authenticationData.user_id,
    );

    // Everything succeeded
    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      result,
    });
  } catch (error) {
    // Something failed
    await client.query("ROLLBACK");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    // Return connection to pool
    client.release();
  }
};


// Login
export const postLogin = async (req, res) => {
    
}