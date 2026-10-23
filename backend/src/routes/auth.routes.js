import express from "express";
import { registerBuyer } from "../controllers/auth.controller.js";


const router = express.Router();

// router.post("/register/customer");

router.post("/register/customer", registerBuyer)

// router.post("/register/merchant", postMerchant);


// router.post("/login", postLogin);

export default router;