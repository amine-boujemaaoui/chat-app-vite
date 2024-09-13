import { useParams } from "react-router-dom";
import { useState } from "react";
import useChatSocket from "@/hooks/useChatSocket";
import ChatLayout from "@/components/ChatLayout";

const PrivateChat = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const [message, setMessage] = useState<string>("");
  const userId = localStorage.getItem("userId");

  const roomName =
    userId && friendId ? [userId, friendId].sort().join("_") : "";
  const {
    username,
    friendUsername,
    users,
    friends,
    privateMessages,
    sendMessage,
  } = useChatSocket(roomName, friendId);

  if (!userId || !friendId) return <p>Erreur : informations manquantes</p>;

  return (
    <ChatLayout
      username={username}
      users={users}
      friends={friends}
      messages={privateMessages} // On affiche uniquement les messages privés ici
      message={message}
      setMessage={setMessage}
      sendMessage={() => {
        sendMessage(message, friendId);
        setMessage("");
      }}
      friendUsername={friendUsername}
    />
  );
};

export default PrivateChat;
