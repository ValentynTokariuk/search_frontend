import type { SearchResult } from "@/lib/api";
import { X, Calendar, Hash, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultDetailsDrawerProps {
  result: SearchResult | null;
  onClose: () => void;
  queryTerms?: string[];
}

export function ResultDetailsDrawer({ result, onClose, queryTerms = [] }: ResultDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  const copyPmid = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.pmid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {result && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border z-50 overflow-y-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">Article Details</h2>
                <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground leading-snug">
                {result.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {result.pubYear}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" /> PMID: {result.pmid}
                </span>
                <button
                  onClick={copyPmid}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy PMID"}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-score-badge text-score-badge-foreground font-medium">
                  <FileText className="h-3 w-3" />
                  Relevance Score: {result.score.toFixed(2)}
                </span>
                {result.matchedTermCount !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-term-badge text-term-badge-foreground font-medium">
                    {result.matchedTermCount} terms matched
                  </span>
                )}
              </div>

              {queryTerms.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Matched Terms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {queryTerms.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-term-badge text-term-badge-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Abstract</p>
                {result.abstract ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {result.abstract}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No abstract available for this article.</p>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
