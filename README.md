
# Chat Application

## Description

Ce projet est une application de chat en temps réel développée avec **Node.js**, **Express**, et une base de données **MySQL**. L'application est contenue dans des conteneurs Docker, ce qui permet une configuration et un déploiement simplifiés. Le projet utilise **Nodemon** pour surveiller les changements en développement et redémarrer automatiquement le serveur.

## Pré-requis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

- **Docker** et **Docker Compose**
- **Node.js** (version 18 ou plus récente)
- **npm** (normalement installé avec Node.js)

## Installation et configuration

### 1. Cloner le projet

```bash
git clone https://github.com/amine-boujemaaoui/chat-app-vite.git
cd chat-app-vite
```

### 2. Configuration avec Docker

Le projet utilise Docker pour isoler l'application et la base de données MySQL. Suivez les étapes ci-dessous pour configurer votre environnement de développement.

#### Démarrer les conteneurs avec Docker Compose

```bash
docker-compose up --build
```

Cela construira et démarrera les conteneurs pour l'application Node.js et MySQL. Une fois terminé, vous devriez avoir deux conteneurs en cours d'exécution :
- **node_app** pour l'application Node.js
- **mysql_container** pour la base de données MySQL

#### Accéder à la base de données MySQL

Pour interagir avec la base de données MySQL à l'intérieur du conteneur, utilisez la commande suivante :

```bash
docker exec -it mysql_container mysql -u chat_user -p
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

- **/src** : Contient le code source de l'application.
- **/docker-compose.yml** : Configuration des services Docker (Node.js et MySQL).
- **/Dockerfile** : Instructions de construction pour le conteneur Node.js.

## Commandes utiles

- **Démarrer l'application avec Docker** : `docker-compose up --build`
- **Accéder à la base de données MySQL dans Docker** : `docker exec -it mysql_container mysql -u chat_user -p`
- **Démarrer l'application en mode développement** : `npm run dev`
- **Arrêter les conteneurs Docker** : `docker-compose down`

## Contributeurs

- Amine BOUJEMAAOUI (amine.boujemaaoui.1@gmail.com)
