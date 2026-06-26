import { Label, Input } from 'facturia-ui';

export function Standalone() {
  return (
    <div className="p-4 flex flex-col gap-3">
      <Label>Razón Social</Label>
      <Label>RUC</Label>
      <Label>Timbrado</Label>
    </div>
  );
}

export function WithInput() {
  return (
    <div className="p-4 w-72 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="razón">Razón Social</Label>
        <Input id="razón" placeholder="Empresa Demo S.A." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ruc">RUC</Label>
        <Input id="ruc" placeholder="80012345-1" />
      </div>
    </div>
  );
}
