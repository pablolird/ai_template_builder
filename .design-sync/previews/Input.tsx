import { Input, Label } from 'facturia-ui';

export function Default() {
  return (
    <div className="p-4 w-72 space-y-2">
      <Label htmlFor="ruc">RUC</Label>
      <Input id="ruc" placeholder="80012345-1" />
    </div>
  );
}

export function States() {
  return (
    <div className="p-4 w-72 space-y-4">
      <div className="space-y-2">
        <Label>Normal</Label>
        <Input placeholder="Razón social" />
      </div>
      <div className="space-y-2">
        <Label>With value</Label>
        <Input defaultValue="Empresa Demo S.A." />
      </div>
      <div className="space-y-2">
        <Label>Disabled</Label>
        <Input placeholder="Disabled" disabled />
      </div>
    </div>
  );
}
