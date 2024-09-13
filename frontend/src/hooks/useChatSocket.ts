import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"; // Import the 'Socket' type

const useChatSocket = (roomName?: string, friendId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [friendUsername, setFriendUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<User>>([]);
  const [friends, setFriends] = useState<Array<User>>([]);
  const [globalMessages, setGlobalMessages] = useState<Array<Message>>([]); // Nouvel état pour les messages globaux
  const [privateMessages, setPrivateMessages] = useState<Array<Message>>([]); // Nouvel état pour les messages privés
  const token = localStorage.getItem("jwt");

  const sortUsers = (a: User, b: User) => {
    if (a.is_online !== b.is_online) {
      return a.is_online === b.is_online ? 0 : a.is_online ? -1 : 1;
    }
    return a.username.localeCompare(b.username);
  };

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:3000", {
        auth: { token },
      });

      setSocket(newSocket);

      if (roomName) {
        newSocket.emit("joinPrivateChat", { friendId, token });
      } else {
        newSocket.emit("join", token);
      }

      newSocket.on("userInfo", (data: { username: string }) => {
        setUsername(data.username);
      });

      if (roomName) {
        newSocket.on(
          "privateUserInfo",
          (data: { username: string; friendUsername: string }) => {
            setUsername(data.username);
            setFriendUsername(data.friendUsername);
          }
        );
      }

      newSocket.on(
        "oldMessages",
        (oldMessages: Array<{ username: string; message: string }>) => {
          setGlobalMessages(
            oldMessages.map((msg: { username: string; message: string }) => ({
              from: msg.username,
              message: msg.message,
            }))
          );
        }
      );

      newSocket.on(
        "oldPrivateMessages",
        (oldMessages: Array<{ username: string; message: string }>) => {
          setPrivateMessages(
            oldMessages.map((msg: { username: string; message: string }) => ({
              from: msg.username,
              message: msg.message,
            }))
          );
        }
      );

      newSocket.on("newMessage", (msg: Message) => {
        setGlobalMessages((prevMessages: Array<Message>) => [
          ...prevMessages,
          msg,
        ]);
      });

      newSocket.on("newPrivateMessage", (msg: Message) => {
        setPrivateMessages((prevMessages: Array<Message>) => [
          ...prevMessages,
          msg,
        ]);
      });

      newSocket.on("userList", (userList: Array<User>) => {
        setUsers(userList.sort(sortUsers));
      });

      newSocket.on("friendsList", (friendsList: Array<User>) => {
        setFriends(friendsList.sort(sortUsers));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, roomName, friendId]);

  const sendMessage = (message: string, to?: string) => {
    if (!username) {
      console.error("Le username n'est pas encore défini.");
      return;
    }

    if (message.trim() && socket && username) {
      if (roomName) {
        socket.emit("sendPrivateMessage", { message, to, from: username });
      } else {
        socket.emit("sendMessage", { message, from: username });
      }
    }
  };

  return {
    socket,
    username,
    friendUsername,
    users,
    friends,
    globalMessages, // Ajout des messages globaux au retour
    privateMessages, // Ajout des messages privés au retour
    sendMessage,
  };
};

export default useChatSocket;
