// routes/friendRoutes.ts
import { Router } from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/add-friend", authenticateToken, addFriend);
router.get("/", authenticateToken, getFriends);

export default router;
