// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connectez-vous à la base de données
connectToDatabase();

// Utilisez les routes
app.use("/auth", authRoutes);
app.use("/friends", friendRoutes);
app.use("/messages", messageRoutes);

export default app;
