import { User } from "@/types/User";
import { UserRoundPlus } from "lucide-react";
import UserItemList from "@/components/UserItemList";

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
    <UserItemList
      users={users}
      username={username}
      onActionClick={handleAddFriend}
      ActionIcon={UserRoundPlus}
    />
  );
};

export default UserList;
