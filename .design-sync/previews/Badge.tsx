import { Badge } from 'facturia-ui';

export function Variants() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}

export function InContext() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge>Active</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">SIFEN</Badge>
      <Badge variant="destructive">Expired</Badge>
    </div>
  );
}
