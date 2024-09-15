// controllers/authController.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const db = getDb();

    // Vérifier si l'email est déjà utilisé
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      res.status(400).json({ message: "Cet email est déjà utilisé" });
      return;
    }

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
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (results.length === 0) {
      res.status(400).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Mot de passe incorrect" });
      return;
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
