// routes/messageRoutes.ts
import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

// Définissez les routes pour les messages si nécessaire
// router.get('/', authenticateToken, getMessages);
// router.post('/', authenticateToken, sendMessage);

export default router;
