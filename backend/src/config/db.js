// config/db.ts
import mysql from "mysql2/promise";
const { Connection } = mysql;

let db = null;

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
      return;
    } catch (err) {
      console.log(
        `Échec de connexion à MySQL. Tentatives restantes : ${retries - 1}`
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
      "La base de données n'est pas connectée. Appelez d'abord connectToDatabase()"
    );
  }
  return db;
}
