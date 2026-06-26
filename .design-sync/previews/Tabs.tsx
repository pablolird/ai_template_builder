import { Tabs, TabsList, TabsTrigger, TabsContent } from 'facturia-ui';

export function Basic() {
  return (
    <div className="p-4 w-80">
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <p className="text-sm text-muted-foreground pt-2">Describe your invoice template in natural language...</p>
        </TabsContent>
        <TabsContent value="preview">
          <p className="text-sm text-muted-foreground pt-2">Your generated invoice will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ThreeTabs() {
  return (
    <div className="p-4 w-80">
      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="es">ES</TabsTrigger>
          <TabsTrigger value="pt">PT</TabsTrigger>
        </TabsList>
        <TabsContent value="en"><p className="text-sm pt-2">English</p></TabsContent>
        <TabsContent value="es"><p className="text-sm pt-2">Español</p></TabsContent>
        <TabsContent value="pt"><p className="text-sm pt-2">Português</p></TabsContent>
      </Tabs>
    </div>
  );
}
