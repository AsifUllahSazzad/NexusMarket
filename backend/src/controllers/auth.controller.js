import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { createBuyer } from "../models/customerModel.js";

export const registerBuyer = async (req, res, next) => {
  const buyerBody = req.body;

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

    const user = await createBuyer(client, {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      mobilePhone: phone.trim(),
      passwordHash,
      deliveryCity: deliveryCity.trim(),
    });

    // console.log(user);

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
          deliveryCity: deliveryCity.trim(),
        },
      },
    });
  } catch (error) {
    if (client && transaction) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        return next(rollbackError);
      }
    }
    // duplicate email find
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
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
