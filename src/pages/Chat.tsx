import useChatSocket from "@/hooks/useChatSocket";
import { useState } from "react";
import ChatLayout from "@/components/ChatLayout";

const Chat = () => {
  // On récupère uniquement les messages globaux
  const { username, users, friends, globalMessages, sendMessage } =
    useChatSocket();
  const [message, setMessage] = useState<string>("");

  return (
    <ChatLayout
      username={username}
      users={users}
      friends={friends}
      messages={globalMessages} // Utilisation des messages globaux
      message={message}
      setMessage={setMessage}
      sendMessage={() => {
        sendMessage(message);
        setMessage("");
      }}
    />
  );
};

export default Chat;
