import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoute from "./routes/auth.routes.js";

const app = express();

const port = process.env.PORT || 3200;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "NexusMarket API is running",
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

app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
