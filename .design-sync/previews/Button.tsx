import { Button } from 'facturia-ui';

export function Variants() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Button>Active</Button>
      <Button variant="outline">Outline Active</Button>
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>Outline Disabled</Button>
    </div>
  );
}
