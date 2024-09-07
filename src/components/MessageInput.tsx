import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

const MessageInput = ({
  message,
  setMessage,
  sendMessage,
}: MessageInputProps) => {
  return (
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
  );
};

export default MessageInput;
