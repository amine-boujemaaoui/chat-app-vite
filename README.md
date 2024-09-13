
# Chat Application

## Description

Ce projet est une application de chat en temps réel utilisant **Node.js** pour le backend, **React** avec **Vite.js** pour le frontend, et **MySQL** pour la base de données. L'application est conteneurisée avec **Docker** pour faciliter la configuration et le déploiement.


### Technologies utilisées

- **Node.js** : Utilisé pour le backend, avec Express pour gérer les routes et les API.
- **Express** : Framework pour Node.js facilitant la création d'applications web et d'API.
- **Socket.io** : Bibliothèque permettant une communication en temps réel bidirectionnelle entre le serveur et les clients.
- **MySQL** : Base de données relationnelle utilisée pour stocker les utilisateurs, les messages, et les relations d'amitié.
- **React (Vite.js)** : Framework pour le frontend, avec Vite.js.js pour la gestion du développement et du build. Vite.js fournit également le Hot Module Replacement (HMR) pour un développement rapide.
- **Docker** : Utilisé pour isoler les différentes parties de l'application (frontend, backend, et base de données) dans des conteneurs, facilitant ainsi le déploiement et le développement.
- **Nodemon** : Utilisé en développement pour redémarrer automatiquement le serveur Node.js à chaque modification de fichier.
- **JWT (JSON Web Tokens)** : Utilisé pour gérer l'authentification et la sécurité des utilisateurs.
- **bcrypt.js** : Utilisé pour le hachage des mots de passe des utilisateurs afin de garantir la sécurité.

## Pré-requis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

- **Docker** et **Docker Compose**
- **npm** (normalement installé avec Node.js)

## Installation et configuration

### 1. Cloner le projet

```bash
git clone https://github.com/amine-boujemaaoui/chat-app-vite.git
cd chat-app-vite
```

### 2. Configuration avec Docker

Le projet utilise Docker pour isoler l'application, le serveur et la base de données MySQL. Suivez les étapes ci-dessous pour configurer votre environnement de développement.

#### Démarrer les conteneurs avec Docker Compose

```bash
docker-compose up --build
```

Cela construira et démarrera les conteneurs pour l'application Node.js, le site React (Vite.js) et MySQL. Une fois terminé, vous devriez avoir trois conteneurs en cours d'exécution :
- **chat_frontend** pour l'application React (Vite.js)
- **chat_backend** pour l'application Node.js
- **chat_mysql** pour la base de données MySQL

#### Accéder à la base de données MySQL

Pour interagir avec la base de données MySQL à l'intérieur du conteneur, utilisez la commande suivante :

```bash
docker exec -it chat_mysql mysql -u chat_user -p
```

Lorsque vous y êtes invité, entrez le mot de passe configuré dans `docker-compose.yml` (par défaut : `chat_password`).

### 3. Utilisation de l'application en mode développement

Si vous préférez travailler en dehors de Docker pour le développement de l'application Node.js, suivez ces étapes pour exécuter l'application localement avec **Nodemon**.

#### Installer les dépendances

```bash
npm install
```

#### Démarrer l'application en mode développement

```bash
npm run dev
```

Cette commande démarre le serveur avec **Nodemon**, qui redémarre automatiquement l'application à chaque changement de fichier.

### 4. Variables d'environnement

Si vous avez besoin de configurer des variables d'environnement supplémentaires, vous pouvez les ajouter dans un fichier `.env` à la racine du projet ou directement dans `docker-compose.yml` sous la section `environment`.

### 5. Accès à l'application

Une fois les conteneurs démarrés, l'application sera disponible sur le port `5173` de votre machine locale :

```
http://localhost:5173/
```

### 6. Arrêter les conteneurs

Pour arrêter tous les conteneurs Docker, exécutez :

```bash
docker-compose down
```

## Structure du projet

- **/frontend** : Contient le code source de l'application frontend React (Vite.js).
- **/backend** : Contient le code source de l'application backend Node.js.
- **/database** : Contient le code source pour la génération de la base de données.
- **/docker-compose.yml** : Configuration des services Docker (Node.js, React et MySQL).

## Commandes utiles

- **Démarrer l'application avec Docker** : `docker-compose up --build`
- **Accéder à la base de données MySQL dans Docker** : `docker exec -it mysql_container mysql -u chat_user -p`
- **Démarrer l'application en mode développement** : `npm run dev`
- **Arrêter les conteneurs Docker** : `docker-compose down`

## Contributeurs

- Amine BOUJEMAAOUI (amine.boujemaaoui.1@gmail.com)
