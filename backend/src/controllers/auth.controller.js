import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { createBuyer } from "../models/customerModel.js";

export const registerBuyer = async (req, res, next) => {
  const buyerBody = req.body;

  console.log("1.----Buyer:------>", buyerBody);

  const { name, email, phone, password, deliveryCity } = buyerBody;

  let client;
  let transaction = false;

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // PostgreSql connection
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");
    transaction = true;

    console.log("2. before database connection");

    const { user, buyerProfile } = await createBuyer(client, {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      mobilePhone: phone.trim(),
      passwordHash,
      deliveryCity: deliveryCity.trim(),
    });

    console.log("4. after database connection");

    // Commit transaction
    await client.query("COMMIT");
    transaction = false;

    // responds to the frontend
    return res.status(201).json({
      success: true,
      message: "Buyer registered successfully.",
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          mobilePhone: user.mobile_phone,
          role: user.role,
          createdAt: user.created_at,
        },
        buyerProfile: {
          deliveryCity: buyerProfile.deliveryCity,
        },
      },
    });
  } catch (error) {
    console.log("--->error-->", error);
    if (client && transaction) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
    }
    // Handle duplicate email
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists",
      });
    }
    return next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};

/*
{
  id: '10',
  full_name: 'Asif',
  email: 'sfdfdsf@g.c',
  mobile_phone: '+880 1620913413',
  role: 'buyer',
  created_at: 2026-10-22T21:27:48.378Z
}
*/
