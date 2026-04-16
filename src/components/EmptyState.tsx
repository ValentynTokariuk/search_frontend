import { BookOpen, Search } from "lucide-react";

const SUGGESTIONS = [
  "diabetes treatment",
  "insulin therapy",
  "diabetic retinopathy",
  "pancreatic cancer",
  "cardiovascular risk diabetes",
];

interface EmptyStateProps {
  onSearch: (query: string) => void;
  noResults?: boolean;
  query?: string;
}

export function EmptyState({ onSearch, noResults, query }: EmptyStateProps) {
  if (noResults) {
    return (
      <div className="text-center py-16">
        <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-foreground">No results found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          No articles matched "<span className="font-medium">{query}</span>". Try different keywords or broader terms.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.slice(0, 3).map((s) => (
            <button
              key={s}
              onClick={() => onSearch(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
      <h3 className="font-display text-xl font-semibold text-foreground">Explore Biomedical Literature</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
        Search through indexed PubMed-style records using BM25 ranked retrieval.
        Enter a query above to discover relevant articles, ranked by relevance scoring.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSearch(s)}
            className="text-sm px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-6">
        Academic demo · Ranked information retrieval · Not medical advice
      </p>
    </div>
  );
}
