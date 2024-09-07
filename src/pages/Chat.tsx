import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ from: string; message: string }>
  >([]);
  const [username, setUsername] = useState<string | null>(null);
  const token = localStorage.getItem("jwt");

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
        console.log(data);
        setMessages(prevMessages => [...prevMessages, data]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  const sendMessage = () => {
    if (message.trim() && socket && username) {
      socket.emit("sendMessage", { message: message, from: username });
      setMessage("");
    }
  };

  return (
    <div className='w-[500px] mx-auto mt-10'>
      <h2 className='text-xl font-bold mb-4'>Chat en temps réel</h2>

      {/* Liste des messages */}
      <div className='h-[300px] overflow-y-scroll border border-gray-300 rounded p-4 mb-4'>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              <strong>{msg.from}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Aucun message pour le moment.</p>
        )}
      </div>

      {/* Input pour envoyer des messages */}
      <div className='flex space-x-2'>
        <Input
          type='text'
          placeholder='Écrire un message...'
          value={message}
          onChange={e => setMessage(e.target.value)}
          className='flex-1'
        />
        <Button onClick={sendMessage}>Envoyer</Button>
      </div>
    </div>
  );
};

export default Chat;
