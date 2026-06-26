import { Separator } from 'facturia-ui';

export function Horizontal() {
  return (
    <div className="p-4 w-64 space-y-4">
      <p className="text-sm font-medium">Invoice details</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Sub-total: Gs. 1.000.000</p>
      <Separator />
      <p className="text-sm font-medium">IVA 10%: Gs. 90.909</p>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="p-4 flex items-center gap-4 h-16">
      <span className="text-sm font-medium">Contado</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-muted-foreground">Crédito</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-muted-foreground">Débito</span>
    </div>
  );
}
