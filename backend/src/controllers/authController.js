// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await db.query(query, [username, email, hashedPassword]);
    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const db = getDb();
    const query = `SELECT * FROM users WHERE email = ?`;
    const [results] = await db.query(query, [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(`Utilisateur connecté: (${user.id}) ${user.username}`);

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
