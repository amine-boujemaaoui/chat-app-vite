import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

async function connectToDatabase(retries = 5) {
  while (retries) {
    try {
      const db = await mysql.createConnection({
        host: "mysql",
        user: "chat_user",
        password: "chat_password",
        database: "chat_db",
      });
      return db;
    } catch (err) {
      console.log(
        `Échec de connexion à MySQL. Tentatives restantes : ${retries}`
      );
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error("Impossible de se connecter à MySQL");
}

const db = await connectToDatabase();

db.connect(err => {
  if (err) {
    console.error("Erreur de connexion à la base de données MySQL:", err);
    process.exit(1);
  }
  console.log("Connecté à la base de données MySQL");
});

const connectedUsers = {};

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await db.query(query, [username, email, hashedPassword]);
    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  try {
    const [results] = await db.query(query, [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/add-friend", async (req, res) => {
  const { friendId } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "secretkey", async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    const userId = decoded.id;

    try {
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
  });
});

// Middleware pour vérifier et décoder le JWT
function authenticateToken(req, res, next) {
  console.log("Authentification en cours...");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      console.error("Erreur de vérification du token:", err);
      return res.status(403).json({ message: "Token invalide" });
    }
    req.user = user; // On attache l'utilisateur décodé à la requête
    next(); // On passe au middleware ou route suivant
  });
}

app.get("/friends", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
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
});

io.on("connection", socket => {
  socket.on("join", async token => {
    try {
      const decoded = jwt.verify(token, "secretkey");
      const userId = decoded.id;
      connectedUsers[userId] = socket.id;

      const updateQuery = `UPDATE users SET is_online = 1 WHERE id = ?`;
      await db.query(updateQuery, [userId]);
      console.log(`Statut mis à jour pour l'utilisateur ${userId}: en ligne`);

      // Récupérer le username de l'utilisateur connecté
      const userInfoQuery = `SELECT id, username FROM users WHERE id = ?`;
      const [userInfo] = await db.query(userInfoQuery, [userId]);

      const friendsQuery = `SELECT id, username, is_online FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ? ORDER BY is_online DESC, username ASC)`;
      const [friendsList] = await db.query(friendsQuery, [userId]);

      // Envoyer la liste des amis à l'utilisateur connecté
      socket.emit("friendsList", friendsList);

      if (userInfo.length > 0) {
        const user = userInfo[0];
        console.log(`Utilisateur connecté assdasdasd: ${user.username}`);

        // Associer le username au socket
        socket.username = user.username;
        socket.emit("userInfo", { username: user.username });
        console.log("Envoi des informations de l'utilisateur");

        // Envoyer la liste des utilisateurs connectés
        const query = `SELECT id, username, is_online FROM users ORDER BY is_online DESC, username ASC`;
        const [results] = await db.query(query);
        io.emit("userList", results);
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
    }
  });

  socket.on("sendMessage", data => {
    console.log("Message reçu du client:", data);
    io.emit("newMessage", data);
  });

  socket.on("friendRequest", async ({ token, friendId }) => {
    try {
      const decoded = jwt.verify(token, "secretkey");
      const userId = decoded.id;

      // Envoie une notification à l'utilisateur
      const notifyUserQuery = `SELECT socket_id FROM users WHERE id = ?`;
      const [friendSocket] = await db.query(notifyUserQuery, [friendId]);

      if (friendSocket.length > 0) {
        io.to(friendSocket[0].socket_id).emit("friendRequestReceived", {
          from: userId,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
    }
  });

  socket.on("friendRequestAccepted", async ({ token, friendId }) => {
    try {
      const decoded = jwt.verify(token, "secretkey");
      const userId = decoded.id;

      // Notifie les deux utilisateurs que la demande a été acceptée
      io.to(socket.id).emit("friendAccepted", { friendId });
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande d'ami:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("Utilisateur déconnecté:", socket.id);
    const userId = Object.keys(connectedUsers).find(
      id => connectedUsers[id] === socket.id
    );

    if (userId) {
      const updateQuery = `UPDATE users SET is_online = 0 WHERE id = ?`;

      try {
        await db.query(updateQuery, [userId]);
        console.log(
          `Statut mis à jour pour l'utilisateur ${userId}: hors ligne`
        );

        delete connectedUsers[userId];
        const query = `SELECT id, username, is_online FROM users ORDER BY is_online DESC, username ASC`;
        const [results] = await db.query(query);
        io.emit("userList", results);
      } catch (err) {
        console.error(
          "Erreur lors de la mise à jour du statut hors ligne:",
          err
        );
      }
    }
  });
});

// Démarre le serveur
server.listen(3000, () => {
  console.log("Le serveur tourne sur le port 3000");
});
