import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  from: string;
  message: string;
}

interface MessageListProps {
  messages: Array<Message>;
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className='w-[500px] mx-auto mt-10'>
      <h2 className='text-xl font-bold mb-4'>Chat en temps réel</h2>
      <ScrollArea className='h-[300px] border rounded mb-4 p-4'>
        {messages.length > 0 ? (
          <>
            {messages.map((msg, index) => (
              <div key={index} className='mb-2'>
                <strong>{msg.from}:</strong> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </>
        ) : (
          <p className='text-gray-500'>Aucun message pour le moment.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageList;
