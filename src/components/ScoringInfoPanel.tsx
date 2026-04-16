import type { BM25Response } from "@/lib/api";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ScoringInfoPanelProps {
  data: BM25Response;
}

export function ScoringInfoPanel({ data }: ScoringInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const { scoring, processedTerms } = data;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Info className="h-4 w-4 text-primary" />
          Ranking Explainability
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Processed Query Terms</p>
            <div className="flex flex-wrap gap-1.5">
              {processedTerms.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-term-badge text-term-badge-foreground font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ranking Model</p>
            <p className="font-medium text-foreground">BM25 (Best Matching 25)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              A probabilistic ranking function that scores documents based on term frequency, document length, and inverse document frequency. Widely used in information retrieval systems.
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Parameters</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <span className="text-muted-foreground">k1 (saturation)</span>
              <span className="font-mono text-foreground">{scoring.k1}</span>
              <span className="text-muted-foreground">b (length norm)</span>
              <span className="font-mono text-foreground">{scoring.b}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Field Weights</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {Object.entries(scoring.fieldWeights).map(([field, weight]) => (
                <div key={field} className="contents">
                  <span className="text-muted-foreground capitalize">{field}</span>
                  <span className="font-mono text-foreground">{weight}×</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Adjustments</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <span className="text-muted-foreground">No abstract penalty</span>
              <span className="font-mono text-foreground">{scoring.noAbstractPenalty}×</span>
              <span className="text-muted-foreground">Letter title penalty</span>
              <span className="font-mono text-foreground">{scoring.letterTitlePenalty}×</span>
              <span className="text-muted-foreground">Coverage boost</span>
              <span className="font-mono text-foreground">+{scoring.queryCoverageBoost}</span>
              <span className="text-muted-foreground">All terms bonus</span>
              <span className="font-mono text-foreground">+{scoring.allTermsMatchBonus}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
