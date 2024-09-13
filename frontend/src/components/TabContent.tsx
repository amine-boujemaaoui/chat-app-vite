import { TabsContent } from "@radix-ui/react-tabs";
import ListCard from "@/components/ListCard";


const TabContent = ({
  value,
  triggerText,
  description,
  children,
}: {
  value: string;
  triggerText: string;
  description: string;
  children: React.ReactNode;
}) => (
  <TabsContent value={value}>
    <ListCard title={triggerText} description={description}>
      {children}
    </ListCard>
  </TabsContent>
);

export default TabContent;