import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, Button, Badge } from 'facturia-ui';

export function Basic() {
  return (
    <div className="p-4 w-80">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Template</CardTitle>
          <CardDescription>Paraguay SIFEN-compliant format</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Includes IVA breakdown (5% / 10%), Condición de Venta, and RUC fields required by SET.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Download</Button>
          <Button size="sm" variant="ghost">Preview</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function WithBadge() {
  return (
    <div className="p-4 w-80">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Empresa Demo S.A.</CardTitle>
            <Badge>Active</Badge>
          </div>
          <CardDescription>RUC: 80012345-1 · Asunción, Paraguay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timbrado</span>
              <span className="font-medium font-mono">12345678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Templates</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
