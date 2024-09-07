import { Button } from "@/components/ui/button";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

interface UserListProps {
    users: Array<User>;
    username: string | null;
}

const UserList = ({ users, username }: UserListProps) => {
  const handleAddFriend = (userId: number) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("Token non trouvé");
      return;
    }

    // Envoi de la requête d'ajout d'ami
    fetch("http://localhost:3000/add-friend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId: userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          console.log(data.message);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la requête d'ajout d'ami:", error);
      });
  };

  return (
    <div className='w-[200px] mx-4 mt-10'>
      <h2 className='text-xl font-bold mb-4'>Utilisateurs</h2>
      <div className='h-[300px] overflow-y-scroll border rounded p-4'>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className='flex items-center mb-2'>
              {/* Badge de statut (vert pour en ligne, rouge pour hors ligne) */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleAddFriend(user.id)}
                className='mr-2'
                disabled={user.username == username}>
                +
              </Button>
              <span
                className={`w-3 h-3 rounded-full mr-2 ${
                  user.is_online ? "bg-green-500" : "bg-red-500"
                }`}></span>
              <span className='mr-2'>{user.username}</span>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>Aucun utilisateur connecté.</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
