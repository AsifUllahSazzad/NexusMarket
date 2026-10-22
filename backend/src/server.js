import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import healthRoute from "./routes/health.routes.js"

import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/not-found.middleware.js";
import validationRoute from './routes/validation.routes.js'


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

// Check:
app.use("/api/health", healthRoute)
app.use("/api/validation", validationRoute);

// Error handle
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
