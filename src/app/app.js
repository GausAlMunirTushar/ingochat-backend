import express from "express";
import { authRoutes } from "../routes/index.js";
import connectDatabase from "../config/database.js";
const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectDatabase();

// Routes
app.use("/api/v1/auth", authRoutes);

export default app;
