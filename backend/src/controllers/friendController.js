// controllers/friendController.js
import { getDb } from "../config/db.js";
import { io } from "../socket/index.js";
import { connectedUsers } from "../utils/connectedUsers.js";

export async function addFriend(req, res) {
  const { friendId } = req.body;
  const userId = req.user.id;

  try {
    const db = getDb();
    const checkFriendQuery = `SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`;
    const [results] = await db.query(checkFriendQuery, [userId, friendId]);
    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur est déjà votre ami" });
    }

    const addFriendQuery = `INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)`;
    await db.query(addFriendQuery, [userId, friendId, friendId, userId]);

    // Envoyer un événement socket à l'utilisateur pour mettre à jour la liste des amis
    const friendsQuery = `SELECT id, username FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ?)`;
    const [friendsList] = await db.query(friendsQuery, [userId]);

    // Notifier l'utilisateur que sa liste d'amis a été mise à jour
    io.to(connectedUsers[userId]).emit("updateFriendsList", friendsList);

    res.json({ message: "Ami ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ami:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'ami" });
  }
}

export async function getFriends(req, res) {
  const userId = req.user.id;
  try {
    const db = getDb();
    const query = `
      SELECT u.id, u.username, u.is_online 
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ?
    `;
    const [friends] = await db.query(query, [userId]);

    res.json(friends);
  } catch (err) {
    console.error("Erreur lors de la récupération des amis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
