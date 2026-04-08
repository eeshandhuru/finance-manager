import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.mjs';
import recordRouter from './routes/recordRoutes.mjs';
import dashboardRouter from './routes/dashboardRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
dotenv.config();

const app = new express()

app.use(express.json());
app.use(cookieParser());

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use("/user", userRouter);
app.use("/records", recordRouter);
app.use("/", dashboardRouter);
app.use("/", authRouter);
app.use(express.static(path.join(__dirname, 'public')));

export default app;