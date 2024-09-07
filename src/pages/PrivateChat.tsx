import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const PrivateChat = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ from: string; message: string }>
  >([]);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (token && friendId) {
      const newSocket = io("http://localhost:3000", {
        auth: { token },
      });

      setSocket(newSocket);

      // Nettoyer les anciens événements avant de les rattacher
      newSocket.off("userInfo");
      newSocket.off("newPrivateMessage");

      // Joindre la salle privée
      newSocket.emit("joinPrivateChat", { friendId, token });

      newSocket.on("oldPrivateMessages", oldMessages => {
        setMessages(
          oldMessages.map((msg: { username: string; message: string }) => ({
            from: msg.username,
            message: msg.message,
          }))
        );
      });

      newSocket.on("userInfo", (data: { username: string }) => {
        setUsername(data.username);
      });

      newSocket.on(
        "newPrivateMessage",
        (data: { from: string; message: string }) => {
          setMessages(prevMessages => [...prevMessages, data]);
        }
      );

      return () => {
        newSocket.disconnect(); // Déconnecter proprement le socket
      };
    }
  }, [token, friendId]); // Déclenchement uniquement si token ou friendId change

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("sendPrivateMessage", { message, to: friendId });
      setMessage("");
    }
  };

  return (
    <div className='flex'>
      <div className='mx-auto'>
        <MessageList messages={messages} username={username} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default PrivateChat;
