import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import MessageList from "../components/MessageList";
import UserList from "../components/UserList";
import MessageInput from "../components/MessageInput";
import FriendList from "../components/FriendList";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

interface Message {
  from: string;
  message: string;
}

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [friends, setFriends] = useState<Array<User>>([]); // Liste des amis
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
        setMessages(prevMessages => [...prevMessages, data]);
      });

      newSocket.on("userList", (userList: Array<User>) => {
        setUsers(userList);
      });

      newSocket.on("friendsList", (friendsList: Array<User>) => {
        setFriends(friendsList);
      });

      // Mettre à jour la liste d'amis en temps réel
      newSocket.on("updateFriendsList", (friendsList: Array<User>) => {
        setFriends(friendsList);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  const sendMessage = () => {
    if (!username) {
      console.error("Username non défini");
      return;
    }

    if (message.trim() && socket) {
      socket.emit("sendMessage", { message: message, from: username });
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
      <UserList users={users} username={username} />
      <FriendList friends={friends} /> {/* Liste des amis */}
    </div>
  );
};

export default Chat;
