import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/Message";

interface MessageListProps {
  messages: Array<Message>;
  username: string | null;
}

const MessageList = ({ messages, username }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className='h-[300px] border rounded mb-4 p-4'>
      {messages.length > 0 ? (
        <>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 max-w-[417px] break-words flex ${
                msg.from === username ? "justify-end" : "justify-start"
              }`}>
              <div
                className={`p-2 rounded-lg text-left ${
                  msg.from === username ? "bg-blue-100" : "bg-gray-100"
                }`}>
                {msg.from !== username && <strong>{msg.from}:</strong>}{" "}
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </>
      ) : (
        <p className='text-gray-500'>Aucun message pour le moment.</p>
      )}
    </ScrollArea>
  );
};

export default MessageList;
