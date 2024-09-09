import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList from "@/components/UserList";
import FriendList from "@/components/FriendList";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { Message } from "@/types/Message";
import { User } from "@/types/User";

interface ChatLayoutProps {
  username: string | null;
  users: Array<User>;
  friends: Array<User>;
  messages: Array<Message>;
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
  friendUsername?: string | null;
}

const ChatLayout = ({
  username,
  users,
  friends,
  messages,
  message,
  setMessage,
  sendMessage,
  friendUsername,
}: ChatLayoutProps) => {
  return (
    <div className='flex h-screen'>
      <div className='mx-auto my-auto flex flex-row'>
        <Card className='mx-4 w-[500px]'>
          <CardHeader>
            <CardTitle className='text-3xl font-normal text-gray-500'>
              {friendUsername ? (
                <>
                  Conversation privée avec{" "}
                  <span className='font-semibold text-black'>
                    {friendUsername}
                  </span>
                </>
              ) : (
                <>
                  Connécté en tant que{" "}
                  <span className='font-semibold text-black'>{username}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <MessageList messages={messages} username={username} />
            <MessageInput
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </CardContent>
        </Card>
        <Tabs defaultValue='users' className='w-[300px]'>
          <TabsList className='grid w-full grid-cols-2 bg-zinc-50'>
            <TabsTrigger value='users' className='mx-1'>
              Users
            </TabsTrigger>
            <TabsTrigger value='friends' className='mx-1'>
              Friends
            </TabsTrigger>
          </TabsList>
          <TabsContent value='users'>
            <Card>
              <CardHeader>
                <CardDescription>
                  Liste des users connectés.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <UserList users={users} username={username} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='friends'>
            <Card>
              <CardHeader>
                <CardDescription>
                  Liste des amis connectés.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FriendList friends={friends} username={username} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatLayout;
