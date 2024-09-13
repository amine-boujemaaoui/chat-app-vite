// routes/messageRoutes.js
import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// Ajoutez vos routes de messages ici si nécessaire
// router.get('/', authenticateToken, getMessages);
// router.post('/', authenticateToken, sendMessage);

export default router;
