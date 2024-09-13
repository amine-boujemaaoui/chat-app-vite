import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const ListCard = ({
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>{children}</CardContent>
    </Card>
  );
};

export default ListCard;
