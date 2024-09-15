// controllers/friendController.ts
import { getDb } from "../config/db.js";
import { io } from "../socket/index.js";
import { connectedUsers } from "../utils/connectedUsers.js";

export async function addFriend(req, res) {
  const { friendId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié" });
    return;
  }

  try {
    const db = getDb();
    const [results] = await db.query(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
      [userId, friendId]
    );
    if (results.length > 0) {
      res.status(400).json({ message: "Cet utilisateur est déjà votre ami" });
      return;
    }

    await db.query(
      "INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)",
      [userId, friendId, friendId, userId]
    );

    // Envoyer un événement socket à l'utilisateur pour mettre à jour la liste des amis
    const [friendsList] = await db.query(
      "SELECT id, username FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ?)",
      [userId]
    );

    // Notifier l'utilisateur que sa liste d'amis a été mise à jour
    const userSocketId = connectedUsers[userId];
    if (userSocketId) {
      io.to(userSocketId).emit("updateFriendsList", friendsList);
    }

    res.json({ message: "Ami ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ami:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'ami" });
  }
}

export async function getFriends(req, res) {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié" });
    return;
  }

  try {
    const db = getDb();
    const [friends] = await db.query(
      `SELECT u.id, u.username, u.is_online 
       FROM friends f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.json(friends);
  } catch (err) {
    console.error("Erreur lors de la récupération des amis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
