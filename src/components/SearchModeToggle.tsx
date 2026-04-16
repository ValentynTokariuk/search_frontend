import type { SearchMode } from "@/lib/api";
import { Sparkles, List } from "lucide-react";

interface SearchModeToggleProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export function SearchModeToggle({ mode, onChange }: SearchModeToggleProps) {
  const options: { value: SearchMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "bm25", label: "BM25 Ranked", icon: <Sparkles className="h-3.5 w-3.5" />, desc: "Recommended" },
    { value: "baseline", label: "Lexical Baseline", icon: <List className="h-3.5 w-3.5" />, desc: "Comparison" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
            mode === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {opt.icon}
          {opt.label}
          {opt.value === "bm25" && mode !== "bm25" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">
              rec
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
