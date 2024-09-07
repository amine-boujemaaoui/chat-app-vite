import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

interface UserListProps {
  users: Array<User>;
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className='w-[200px] mx-4 mt-10'>
      <h2 className='text-xl font-bold mb-4'>Utilisateurs</h2>
      <ScrollArea className='h-[300px] border rounded p-4'>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className='flex items-center mb-2'>
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  user.is_online ? "bg-green-500" : "bg-red-500"
                }`}></span>
              <span>{user.username}</span>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Aucun utilisateur connecté.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default UserList;
