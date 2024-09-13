// routes/friendRoutes.js
import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add-friend", authenticateToken, addFriend);
router.get("/", authenticateToken, getFriends);

export default router;
