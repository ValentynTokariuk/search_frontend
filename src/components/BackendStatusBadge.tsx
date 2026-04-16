import { useQuery } from "@tanstack/react-query";
import { checkHealth } from "@/lib/api";
import { Activity } from "lucide-react";

export function BackendStatusBadge() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: checkHealth,
    refetchInterval: 30000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Activity className="h-3 w-3 animate-pulse" /> Checking…
      </span>
    );
  }

  if (isError || !data?.ok) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Backend offline
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" /> Connected
    </span>
  );
}
