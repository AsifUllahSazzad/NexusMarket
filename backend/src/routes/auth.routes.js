import express from "express";
import { postCustomer, postMerchant } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register/merchant", postMerchant);

router.post("/register/customer", postCustomer);

export default router;
