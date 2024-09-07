# Utilise une image officielle de Node.js
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installe les dépendances du projet
RUN npm install

# Copie tout le code source dans le conteneur
COPY . .

# Expose le port 3000 pour permettre l'accès à l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
