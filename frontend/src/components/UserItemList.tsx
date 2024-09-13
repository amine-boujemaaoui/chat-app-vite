import { User } from "../types/User";
import { ScrollArea } from "../components/ui/scroll-area";

interface UserItemListProps {
  users: Array<User>;
  username: string | null;
  onActionClick: (userId: number) => void; // Action pour l'utilisateur
  ActionIcon: React.ElementType; // Icône pour l'action (MessageSquare ou UserRoundPlus)
}

const UserItemList = ({
  users,
  username,
  onActionClick,
  ActionIcon,
}: UserItemListProps) => {
  return (
    <ScrollArea className='h-[350px] border rounded pl-4 pt-4'>
      {users.length > 0 ? (
        users.map(
          (user, index) =>
            username !== user.username && (
              <div
                key={index}
                className='relative flex items-center mb-2 hover:pl-6 transition-all duration-300 hover:bg-gray-100 group'>
                <ActionIcon
                  onClick={() => onActionClick(user.id)}
                  className='mx-2 size-4 text-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                />
                <span
                  className={`w-3 h-3 rounded-full absolute left-0 ml-2 ${
                    user.is_online ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className='mr-2'>{user.username}</span>
              </div>
            )
        )
      ) : (
        <p className='text-gray-500'>Aucun utilisateur connecté.</p>
      )}
    </ScrollArea>
  );
};

export default UserItemList;
