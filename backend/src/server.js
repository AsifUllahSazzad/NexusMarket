import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

const port = process.env.PORT || 3200;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "NexusMarket API is running",
  });
});

import authRoute from './routes/auth.routes.js';
app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
