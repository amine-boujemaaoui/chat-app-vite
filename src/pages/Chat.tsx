import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ from: string; message: string }>
  >([]);
  const [users, setUsers] = useState<Array<User>>([]); // Liste des utilisateurs connectés/déconnectés
  const [username, setUsername] = useState<string | null>(null);
  const token = localStorage.getItem("jwt");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:3000", {
        auth: { token },
      });

      setSocket(newSocket);

      newSocket.emit("join", token);

      newSocket.on("userInfo", (data: { username: string }) => {
        setUsername(data.username);
      });

      newSocket.on("newMessage", (data: { from: string; message: string }) => {
        setMessages(prevMessages => [...prevMessages, data]);
      });

      // Réception de la liste des utilisateurs
      newSocket.on("userList", (userList: Array<User>) => {
        setUsers(userList);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!username) {
      console.error("Username non défini");
      return;
    }

    if (message.trim() && socket) {
      console.log(`Envoi du message par ${username}: ${message}`);
      socket.emit("sendMessage", { message: message, from: username });
      setMessage("");
    } else {
      console.error("Message vide ou socket non défini");
    }
  };

  return (
    <div className="flex">
      {/* Liste des messages */}
      <div className="w-[500px] mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">
          Connécté en tant que {username}
        </h2>
        <ScrollArea className="h-[300px] border rounded mb-4 p-4">
          {messages.length > 0 ? (
            <>
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.from}:</strong> {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </>
          ) : (
            <p className="text-gray-500">Aucun message pour le moment.</p>
          )}
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Écrire un message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button onClick={sendMessage}>Envoyer</Button>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="w-[200px] mx-4 mt-10">
        <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
        <ScrollArea className="h-[300px] border rounded p-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <>
                <div key={index} className="flex items-center mb-2">
                  {/* Badge de statut (vert pour en ligne, rouge pour hors ligne) */}
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      user.is_online ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>{user.username}</span>
                </div>
              </>
            ))
          ) : (
            <p className="text-gray-500">Aucun utilisateur connecté.</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Chat;
