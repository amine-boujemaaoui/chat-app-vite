# Utiliser une image Node.js de base
FROM node:18

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances, y compris les dépendances de développement
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port que l'application utilise
EXPOSE 3000

# Démarrer l'application en fonction de l'environnement
# Utilise nodemon en développement et node en production
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then node server.js; else npx nodemon server.js; fi"]
