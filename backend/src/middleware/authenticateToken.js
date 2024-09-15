// middleware/authenticateToken.ts
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  console.log("Authentification en cours...");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erreur de vérification du token:", err);
      res.status(403).json({ message: "Token invalide" });
      return;
    }
    req.user = user; // On attache l'utilisateur décodé à la requête
    next(); // On passe au middleware ou route suivant
  });
}
