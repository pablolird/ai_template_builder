import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from 'facturia-ui';

export function Basic() {
  return (
    <div className="p-4 w-64 space-y-2">
      <Label htmlFor="country">Country</Label>
      <Select defaultValue="py">
        <SelectTrigger id="country">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="py">Paraguay</SelectItem>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="ar">Argentina</SelectItem>
          <SelectItem value="bo">Bolivia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function Placeholder() {
  return (
    <div className="p-4 w-64 space-y-2">
      <Label>Payment method</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a method..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Contado (Cash)</SelectItem>
          <SelectItem value="credit">Crédito (Credit)</SelectItem>
          <SelectItem value="transfer">Bank Transfer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
