import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import healthRoute from "./routes/health.routes.js";
import validationRoute from "./routes/validation.routes.js";
import authRoute from "./routes/auth.routes.js";
import adminRoute from "./routes/admin.routes.js";
import merchantRoute from "./routes/merchant.routes.js";
import productRoute from "./routes/product.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/not-found.middleware.js";

const app = express();
const port = process.env.PORT || 3000;

/* ======================================
 1. CORS CONFIGURATION
 ====================================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

/* ======================================
 2. Express Configuration
 ====================================== */
app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

/* ======================================
 3. PUBLIC ROUTES
 ====================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexusMarket API is Running",
  });
});

// Database connection test
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected",
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

/* ======================================
 4. API ROUTES
 ====================================== */
app.use("/api/health", healthRoute);
app.use("/api/validation", validationRoute);

// Authentication
app.use("/api/auth", authRoute);

// Admin
app.use("/api/admin", adminRoute);

// Merchant
app.use("/api/merchant", merchantRoute);

// Merchant-Product
app.use("/api/merchant/products", productRoute);

/* ======================================
 5. ERROR HANDLING
 ====================================== */
app.use(notFound);
app.use(errorHandler);

/* ======================================
 6. SERVER
 ====================================== */
app.listen(port, () => {
  console.log(`NexusMarket API running on port ${port}`);
});
