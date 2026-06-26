import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, Input, Label, Button } from 'facturia-ui';

export function CompanyPreset() {
  return (
    <Sheet open>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Company Preset</SheetTitle>
          <SheetDescription>Edit your company details for Paraguay SIFEN invoices.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Razón Social</Label>
            <Input defaultValue="Empresa Demo S.A." />
          </div>
          <div className="space-y-1.5">
            <Label>RUC</Label>
            <Input defaultValue="80012345-1" />
          </div>
          <div className="space-y-1.5">
            <Label>Timbrado</Label>
            <Input defaultValue="12345678" />
          </div>
          <Button className="w-full">Save preset</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
