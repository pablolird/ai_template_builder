import { Skeleton } from 'facturia-ui';

export function CardLoading() {
  return (
    <div className="p-4 w-72 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export function ListLoading() {
  return (
    <div className="p-4 w-72 space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}
