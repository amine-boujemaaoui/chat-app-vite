import { useNavigate } from "react-router-dom";

interface Friend {
  id: number;
  username: string;
  is_online: boolean;
}

interface FriendListProps {
  friends: Array<Friend>;
}

const FriendList = ({ friends }: FriendListProps) => {
  const navigate = useNavigate();

  const handleFriendClick = (friendId: number) => {
    navigate(`/private-chat/${friendId}`);
  };

  return (
    <div className='w-[200px] mx-4 mt-10'>
      <h2 className='text-xl font-bold mb-4'>Amis</h2>
      <div className='h-[300px] overflow-y-scroll border rounded p-4'>
        {friends.length > 0 ? (
          friends.map(friend => (
            <div
              key={friend.id} // Utiliser friend.id comme clé unique
              className='flex items-center mb-2'
              role='button' // Ajout d'un rôle pour l'accessibilité
              onClick={() => handleFriendClick(friend.id)} // Sur toute la ligne pour plus de simplicité
            >
              {/* Badge de statut (vert pour en ligne, rouge pour hors ligne) */}
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  friend.is_online ? "bg-green-500" : "bg-red-500"
                }`}></span>
              <span className='cursor-pointer'>{friend.username}</span>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Aucun ami connecté.</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
