import { Textarea, Label } from 'facturia-ui';

export function Default() {
  return (
    <div className="p-4 w-80 space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" placeholder="Additional details for this invoice..." rows={4} />
    </div>
  );
}

export function WithContent() {
  return (
    <div className="p-4 w-80 space-y-2">
      <Label>Invoice description</Label>
      <Textarea defaultValue="Prestación de servicios de consultoría en tecnología de la información para el mes de junio 2025." rows={3} />
    </div>
  );
}
