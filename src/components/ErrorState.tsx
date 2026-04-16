import { AlertCircle, WifiOff } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <WifiOff className="h-10 w-10 text-destructive/60 mx-auto mb-3" />
      <h3 className="font-display text-lg font-semibold text-foreground">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto flex items-center justify-center gap-1.5">
        <AlertCircle className="h-3.5 w-3.5" />
        {message || "Could not connect to the search backend. Make sure it's running on localhost:4000."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      )}
    </div>
  );
}
