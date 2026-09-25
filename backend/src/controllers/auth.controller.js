import pool from "../config/db.js";
import { insertCustomerProfile } from "../models/customerModel.js";
import { insertMerchantProfile } from "../models/merchantModel.js";
import {
  findLoginUser,
  findUserByEmailOrPhone,
  insertUserData,
} from "../models/userModel.js";
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
    const existingUser = await findUserByEmailOrPhone(
      email,
      phone,
      tradeLicense,
    );

    if (existingUser) {
      const errors = {};

      if (existingUser.email === email) {
        errors.email = "Email is already registered";
      }

      if (existingUser.phone === phone) {
        errors.phone = "Phone number is already registered";
      }

      if (existingUser.trade_license === tradeLicense) {
        errors.tradeLicense = "Trade license is already registered";
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
  const { email, password } = req.body;

  try {
    const result = await findLoginUser(email);

    const errors = {};

    // user not found -> email
    if (!result) {
      errors.email = "Account not found";
      return res.status(404).json({
        success: false,
        errors,
      });
    }

    // password match check
    const isPasswordCorrect = await bcrypt.compare(
      password,
      result.password_hash,
    );

    if (!isPasswordCorrect) {
      errors.password = "Incorrect password";

      return res.status(401).json({
        success: false,
        errors,
      });
    }

    /*
    {
  user_id: '85cd268c-1ab9-4862-a38e-297318966323',
  full_name: 'Asif Khan',
  email: 'asifkhan@gmail.com',
  phone: '+8801783457453',
  password_hash: '$2b$15$whQEK4lQS1g7lbBXVzA5c.Qzynic2T9NCpFsCiWVvDLdw/vUIfxWK',
  role: 'buyer',
  is_active: true,
  created_at: 2026-09-24T20:33:52.271Z,
  updated_at: 2026-09-24T20:33:52.271Z
}
    */
  } catch (error) {
    console.log(error);
  }
};
