import { Search, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const EXAMPLE_QUERIES = [
  "diabetes treatment",
  "insulin therapy",
  "diabetic retinopathy",
  "pancreatic cancer",
  "cardiovascular risk diabetes",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
}

export function SearchBar({ onSearch, isLoading, initialQuery = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center rounded-lg border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
          <Search className="ml-4 h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search biomedical articles…"
            className="flex-1 px-3 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base font-body"
          />
          {value && (
            <button
              type="button"
              onClick={() => { setValue(""); }}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="m-1.5 px-5"
          >
            {isLoading ? "Searching…" : "Search"}
          </Button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-muted-foreground mr-1 py-1">Try:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => { setValue(q); onSearch(q); }}
            className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
