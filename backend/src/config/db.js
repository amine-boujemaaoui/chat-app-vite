// config/db.js
import mysql from "mysql2/promise";

let db;

export async function connectToDatabase(retries = 5) {
  console.log("Connexion à MySQL...");

  while (retries) {
    try {
      db = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });
      console.log("Connecté à la base de données MySQL");
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

export function getDb() {
  if (!db) {
    throw new Error(
      "La base de données n'est pas connectée. Veuillez appeler connectToDatabase d'abord."
    );
  }
  return db;
}
