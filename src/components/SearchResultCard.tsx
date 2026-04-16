import type { SearchResult } from "@/lib/api";
import { FileText, Calendar, Hash, Copy, Check } from "lucide-react";
import { useState } from "react";

interface SearchResultCardProps {
  result: SearchResult;
  rank: number;
  queryTerms?: string[];
  onClick: () => void;
}

function highlightTerms(text: string, terms: string[]) {
  if (!terms.length || !text) return text;
  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-snippet-highlight text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchResultCard({ result, rank, queryTerms = [], onClick }: SearchResultCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPmid = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result.pmid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const displayText = result.snippet || result.abstract || "";
  const truncated = displayText.length > 280 ? displayText.slice(0, 280) + "…" : displayText;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-result-hover hover:border-primary/30 transition-all group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-muted-foreground mt-1 shrink-0 w-6 text-right">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {highlightTerms(result.title, queryTerms)}
          </h3>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {result.pubYear}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" /> PMID: {result.pmid}
            </span>
            <button
              onClick={copyPmid}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              title="Copy PMID"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          {truncated && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {highlightTerms(truncated, queryTerms)}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-score-badge text-score-badge-foreground font-medium">
              <FileText className="h-3 w-3" />
              Score: {result.score.toFixed(2)}
            </span>
            {result.matchedTermCount !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-term-badge text-term-badge-foreground font-medium">
                {result.matchedTermCount} terms matched
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
