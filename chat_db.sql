-- Création de la base de données
CREATE DATABASE IF NOT EXISTS chat_db;

USE chat_db;

-- Création de la table `users`
CREATE TABLE
    IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_online BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Création de la table `friends` pour gérer les relations d'amis
CREATE TABLE
    IF NOT EXISTS friends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        friend_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (friend_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- Création de la table `messages` pour stocker les messages de chat
CREATE TABLE
    IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        from_user_id INT,
        to_user_id INT NULL, -- NULL signifie un message public, non NULL pour un message privé
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        room_name VARCHAR(255) -- Le nom de la salle (par exemple '1_4' pour un chat privé, 'global' pour un chat global)
    );