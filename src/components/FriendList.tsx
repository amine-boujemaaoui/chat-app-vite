import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { User } from "@/types/User";
import UserItemList from "@/components/UserItemList";

interface FriendListProps {
  friends: Array<User>;
  username: string | null;
}

const FriendList = ({ friends, username }: FriendListProps) => {
  const navigate = useNavigate();

  const handleFriendClick = (friendId: number) => {
    navigate(`/private-chat/${friendId}`);
  };

  return (
    <UserItemList
      users={friends}
      username={username}
      onActionClick={handleFriendClick}
      ActionIcon={MessageSquare}
    />
  );
};

export default FriendList;
