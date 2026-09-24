import { findUserByEmailOrPhone } from "../models/userModel.js";
import bcrypt from "bcrypt";

/*
Merchant Success:  {
  name: 'fasdfasdf',
  storeName: 'fasdfsadf',
  email: 'fsadfasdf@g.c',
  phone: '+8801620913413',
  category: 'Electronics & Audio',
  tradeLicense: 'asdfdas234fdsdsfsd',
  password: 'fasdfasdfF32'
}
*/

export const postMerchant = async (req, res) => {
  try {
    const merchantRegisterData = await req.body;

    const { email, phone, password } = merchantRegisterData;

    console.log("Merchant Success: ", merchantRegisterData);

    // check user exist
    const existingUser = await findUserByEmailOrPhone(email, phone);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    // password hashing+salt:
    const hashedPassword = await bcrypt.hash(password, 15);

    // insert user:

    return res.status(201).json({
      success: true,
      message: "No duplicate email or phone found",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const postCustomer = async (req, res) => {
  try {
    const customerRegisterData = await req.body;

    const { email, phone } = customerRegisterData;

    console.log("Customer Success: ", customerRegisterData);

    // check user exist
    const existingUser = await findUserByEmailOrPhone(email, phone);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    return res.status(201).json({
      success: true,
      message: "No duplicate email or phone found",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
