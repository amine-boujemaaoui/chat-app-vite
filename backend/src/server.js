// server.js
import http from "http";
import app from "./app.js";
import { initSocket } from "./socket/index.js";

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
