import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import adRoutes from "./routes/ad.js";

const app = express();

//Database connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected");

    app.use("/api", authRoutes);
    app.use("/api", adRoutes);
    app.listen(8000, () => {
      console.log("The server is listening on 8000");
    });
  })
  .catch((err) => {
    console.log("DB connection error", err);
  });

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
