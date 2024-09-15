// src/socket/index.ts

import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";
import { connectedUsers } from "../utils/connectedUsers.js";

export let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", socketHandler);
}

async function socketHandler(socket) {
  const db = getDb();

  socket.on("join", async (token) => {
    if (!socket.joined) {
      // Assurez-vous qu'il ne rejoint qu'une seule fois
      socket.joined = true;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        connectedUsers[userId] = socket.id;
        socket.userId = userId;

        // Mettre à jour le statut de l'utilisateur en ligne
        const updateQuery = "UPDATE users SET is_online = 1 WHERE id = ?";
        await db.query(updateQuery, [userId]);

        // Récupérer et envoyer les anciens messages globaux
        const query = `
          SELECT u.username, m.message, m.created_at FROM messages m
          JOIN users u ON m.from_user_id = u.id
          WHERE m.room_name = 'global'
          ORDER BY m.created_at ASC
        `;
        const [messages] = await db.query(query);
        socket.emit("oldMessages", messages);

        // Envoyer les informations d'utilisateur et la liste des utilisateurs
        const userInfoQuery = "SELECT id, username FROM users WHERE id = ?";
        const [userInfo] = await db.query(userInfoQuery, [userId]);

        const userListQuery = "SELECT id, username, is_online FROM users";
        const [userList] = await db.query(userListQuery);
        io.emit("userList", userList);

        // Envoyer la liste des amis à l'utilisateur
        const friendsQuery = `
          SELECT id, username, is_online FROM users
          WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ?)
        `;
        const [friendsList] = await db.query(friendsQuery, [userId]);
        socket.emit("friendsList", friendsList);

        // Mettre à jour les amis de l'utilisateur connecté
        friendsList.forEach(async (friend) => {
          const friendSocketId = connectedUsers[friend.id];
          if (friendSocketId) {
            const [updatedFriendsList] = await db.query(friendsQuery, [
              friend.id,
            ]);
            io.to(friendSocketId).emit("friendsList", updatedFriendsList);
          }
        });

        if (userInfo.length > 0) {
          const user = userInfo[0];
          console.log(`Utilisateur connecté: ${user.username}`);
          socket.username = user.username;

          socket.emit("userInfo", { username: socket.username });
          console.log("Envoi des informations de l'utilisateur");
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
      }
    }
  });

  socket.on(
    "joinPrivateChat",
    async ({ friendId, token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        socket.userId = userId;

        // Mettre à jour le statut de l'utilisateur en ligne
        const updateQuery = "UPDATE users SET is_online = 1 WHERE id = ?";
        await db.query(updateQuery, [userId]);

        // Récupérer la liste des amis de l'utilisateur connecté
        const friendsQuery = `
        SELECT id, username, is_online FROM users
        WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ?)
      `;
        const [friendsList] = await db.query(friendsQuery, [userId]);

        // Envoyer la liste mise à jour des amis pour chaque ami
        friendsList.forEach(async (friend) => {
          const friendSocketId = connectedUsers[friend.id];
          if (friendSocketId) {
            const [updatedFriendsList] = await db.query(friendsQuery, [
              friend.id,
            ]);
            io.to(friendSocketId).emit("friendsList", updatedFriendsList);
          }
        });

        // Rejoindre la salle privée
        const roomName = [userId, friendId].sort().join("_");
        const query = `
        SELECT u.username, m.message, m.created_at FROM messages m
        JOIN users u ON m.from_user_id = u.id
        WHERE m.room_name = ?
        ORDER BY m.created_at ASC
      `;
        const [messages] = await db.query(query, [roomName]);
        socket.emit("oldPrivateMessages", messages);
        socket.join(roomName);

        // Récupérer les informations utilisateur et ami
        const userInfoQuery = "SELECT id, username FROM users WHERE id = ?";
        const [userInfo] = await db.query(userInfoQuery, [userId]);

        const friendInfoQuery = "SELECT id, username FROM users WHERE id = ?";
        const [friendInfo] = await db.query(friendInfoQuery, [friendId]);

        // Envoyer la liste des amis à l'utilisateur
        socket.emit("friendsList", friendsList);

        if (userInfo.length > 0 && friendInfo.length > 0) {
          const user = userInfo[0];
          const friend = friendInfo[0];
          socket.username = user.username;

          // Envoyer une confirmation à l'utilisateur qu'il a rejoint la salle privée
          socket.emit("privateChatJoined", {
            roomName,
            friendId,
            username: socket.username,
          });

          // Envoyer le username et le friendUsername
          socket.emit("privateUserInfo", {
            username: socket.username,
            friendUsername: friend.username,
          });

          console.log(
            `Utilisateur ${socket.username} a rejoint la salle privée ${roomName} avec ${friend.username}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de l'entrée dans la salle privée:", error);
      }
    }
  );

  socket.on(
    "sendPrivateMessage",
    async ({ message, to }) => {
      const roomName = [socket.userId, to].sort().join("_");

      try {
        // Récupérer le username de l'utilisateur à partir de la base de données
        const userInfoQuery = "SELECT username FROM users WHERE id = ?";
        const [userInfo] = await db.query(userInfoQuery, [socket.userId]);

        if (userInfo.length > 0) {
          const username = userInfo[0].username;

          // Insérer le message dans la base de données
          const query =
            "INSERT INTO messages (from_user_id, to_user_id, message, room_name) VALUES (?, ?, ?, ?)";
          await db.query(query, [socket.userId, to, message, roomName]);

          console.log(
            `(userId: ${socket.userId}, to: ${to}) Envoie du message: ${message} à la salle privée ${roomName}`
          );

          // Envoyer le message avec le username de l'expéditeur
          io.to(roomName).emit("newPrivateMessage", {
            from: username,
            message: message,
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du message privé:", error);
      }
    }
  );

  socket.on("sendMessage", async (data) => {
    console.log("Message reçu du client:", data);
    const { message } = data;

    // Enregistrer le message dans la base de données
    const query =
      "INSERT INTO messages (from_user_id, message, room_name) VALUES (?, ?, ?)";
    await db.query(query, [socket.userId, message, "global"]);
    io.emit("newMessage", data);
  });

  socket.on(
    "friendRequest",
    async ({ token, friendId }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Envoie une notification à l'utilisateur
        const notifyUserQuery = "SELECT socket_id FROM users WHERE id = ?";
        const [friendSocket] = await db.query(notifyUserQuery, [friendId]);

        if (friendSocket.length > 0) {
          io.to(friendSocket[0].socket_id).emit("friendRequestReceived", {
            from: userId,
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      }
    }
  );

  socket.on(
    "friendRequestAccepted",
    async ({ token, friendId }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        io.to(socket.id).emit("friendAccepted", { friendId });
      } catch (error) {
        console.error(
          "Erreur lors de l'acceptation de la demande d'ami:",
          error
        );
      }
    }
  );

  socket.on("disconnect", async () => {
    console.log("Utilisateur déconnecté:", socket.id);
    const userId = socket.userId;

    if (userId) {
      const updateQuery = "UPDATE users SET is_online = 0 WHERE id = ?";

      try {
        await db.query(updateQuery, [userId]);
        console.log(
          `Statut mis à jour pour l'utilisateur ${userId}: hors ligne`
        );

        // Mettre à jour la liste des utilisateurs globaux
        delete connectedUsers[userId];
        const query = "SELECT id, username, is_online FROM users";
        const [results] = await db.query(query);
        io.emit("userList", results);

        // Récupérer la liste des amis de l'utilisateur déconnecté
        const friendsQuery = `
          SELECT u.id, u.username, u.is_online 
          FROM friends f
          JOIN users u ON u.id = f.friend_id
          WHERE f.user_id = ?
        `;
        const [friendsList] = await db.query(friendsQuery, [userId]);

        // Envoyer la liste mise à jour des amis pour chaque ami
        friendsList.forEach(async (friend) => {
          const friendSocketId = connectedUsers[friend.id];
          if (friendSocketId) {
            const [updatedFriendsList] = await db.query(friendsQuery, [
              friend.id,
            ]);
            io.to(friendSocketId).emit("friendsList", updatedFriendsList);
          }
        });
      } catch (err) {
        console.error(
          "Erreur lors de la mise à jour du statut hors ligne:",
          err
        );
      }
    }
  });
}
