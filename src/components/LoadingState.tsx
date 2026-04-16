export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-border bg-card animate-pulse-soft">
          <div className="flex items-start gap-3">
            <div className="w-6 h-4 bg-muted rounded mt-1" />
            <div className="flex-1 space-y-2.5">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="flex gap-3">
                <div className="h-3 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded-full w-20" />
                <div className="h-5 bg-muted rounded-full w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
