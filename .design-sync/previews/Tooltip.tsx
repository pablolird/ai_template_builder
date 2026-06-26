import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Button } from 'facturia-ui';

export function Basic() {
  return (
    <TooltipProvider>
      <div className="p-8 flex gap-4">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm">↓</Button>
          </TooltipTrigger>
          <TooltipContent>Download HTML</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm">↗</Button>
          </TooltipTrigger>
          <TooltipContent>Open in new tab</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function OnText() {
  return (
    <TooltipProvider>
      <div className="p-8">
        <Tooltip open>
          <TooltipTrigger className="text-sm underline decoration-dotted cursor-help">
            RUC
          </TooltipTrigger>
          <TooltipContent>Registro Único del Contribuyente — Paraguay tax ID</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
