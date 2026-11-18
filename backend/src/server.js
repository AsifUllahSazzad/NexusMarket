import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexusMarket API is Running",
  });
});

// database connection test
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

// Demo Check
import healthRoute from "./routes/health.routes.js";
import validationRoute from "./routes/validation.routes.js";
app.use("/api/health", healthRoute);
app.use("/api/validation", validationRoute);

// Customer and Merchant Auth Route
import authRoute from "./routes/auth.routes.js";
app.use("/api/auth", authRoute);

// Admin Route
import adminRoute from "./routes/admin.routes.js";
app.use("/api/admin", adminRoute);

// Merchant Route
import merchantRoute from "./routes/merchant.routes.js";
app.use("/api/merchant", merchantRoute);

// Product Route
import productRoute from "./routes/product.routes.js";
app.use("/api/products", productRoute);

// Error handle
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/not-found.middleware.js";
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
