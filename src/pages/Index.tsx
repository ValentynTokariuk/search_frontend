import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Database, ArrowDown } from "lucide-react";
import type { SearchMode, SearchResult, BM25Response, BaselineResponse } from "@/lib/api";
import { searchBM25, searchBaseline } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";
import { SearchModeToggle } from "@/components/SearchModeToggle";
import { SearchResultCard } from "@/components/SearchResultCard";
import { ScoringInfoPanel } from "@/components/ScoringInfoPanel";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { BackendStatusBadge } from "@/components/BackendStatusBadge";
import { ResultDetailsDrawer } from "@/components/ResultDetailsDrawer";
import { Button } from "@/components/ui/button";

const LIMIT = 20;

export default function Index() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("bm25");
  const [offset, setOffset] = useState(0);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery<BM25Response | BaselineResponse>({
    queryKey: ["search", mode, submittedQuery, offset],
    queryFn: async () => {
      return mode === "bm25"
        ? await searchBM25(submittedQuery, LIMIT, offset)
        : await searchBaseline(submittedQuery, LIMIT, offset);
    },
    enabled: !!submittedQuery,
  });

  // Accumulate results for "load more"
  const currentResults = (() => {
    if (!data) return allResults;
    if (offset === 0) return data.results;
    // Append new results
    const existingIds = new Set(allResults.map(r => r.pmid));
    const newResults = data.results.filter(r => !existingIds.has(r.pmid));
    return [...allResults, ...newResults];
  })();

  // Sync accumulated results
  if (data && currentResults !== allResults) {
    // This is fine in render since we're comparing references
  }

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setSubmittedQuery(q);
    setOffset(0);
    setAllResults([]);
  }, []);

  const handleModeChange = useCallback((newMode: SearchMode) => {
    setMode(newMode);
    setOffset(0);
    setAllResults([]);
  }, []);

  const handleLoadMore = () => {
    setAllResults(currentResults);
    setOffset(prev => prev + LIMIT);
  };

  const bm25Data = mode === "bm25" && data && "processedTerms" in data ? data as BM25Response : null;
  const processedTerms = bm25Data?.processedTerms || [];
  const totalCount = data?.count || 0;
  const displayResults = offset === 0 ? (data?.results || []) : currentResults;
  const hasMore = data ? data.results.length === LIMIT : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-hero-bg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                BioSearch
              </h1>
            </div>
            <BackendStatusBadge />
          </div>

          <p className="text-muted-foreground text-sm max-w-xl mb-6">
            Search biomedical articles indexed from PubMed-style records. Ranked retrieval powered by BM25 scoring.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={query} />

          {submittedQuery && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mt-5"
            >
              <SearchModeToggle mode={mode} onChange={handleModeChange} />
            </motion.div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {!submittedQuery && (
          <EmptyState onSearch={handleSearch} />
        )}

        {submittedQuery && isError && (
          <ErrorState
            message={(error as Error)?.message}
            onRetry={() => setSubmittedQuery(submittedQuery)}
          />
        )}

        {submittedQuery && isLoading && offset === 0 && (
          <LoadingState />
        )}

        {submittedQuery && data && (
          <div className="flex gap-6">
            {/* Results column */}
            <div className="flex-1 min-w-0">
              {/* Summary bar */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{totalCount}</span> results for "
                  <span className="font-medium">{data.query}</span>"
                  {mode === "bm25" && (
                    <span className="text-xs ml-2 text-primary">· Ranked by relevance</span>
                  )}
                </p>
                {mode !== "bm25" && (
                  <span className="text-xs text-muted-foreground italic">
                    Baseline mode — no ranking applied
                  </span>
                )}
              </div>

              {displayResults.length === 0 && !isLoading ? (
                <EmptyState onSearch={handleSearch} noResults query={submittedQuery} />
              ) : (
                <div className="space-y-2.5">
                  {displayResults.map((result, i) => (
                    <motion.div
                      key={result.pmid}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <SearchResultCard
                        result={result}
                        rank={i + 1}
                        queryTerms={processedTerms}
                        onClick={() => setSelectedResult(result)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    className="gap-2"
                  >
                    <ArrowDown className="h-4 w-4" />
                    {isFetching ? "Loading…" : "Load more results"}
                  </Button>
                </div>
              )}
            </div>

            {/* Side panel */}
            {bm25Data && (
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-6">
                  <ScoringInfoPanel data={bm25Data} />
                </div>
              </aside>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
        Academic demo · Information Retrieval · Not medical advice
      </footer>

      {/* Details drawer */}
      <ResultDetailsDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
        queryTerms={processedTerms}
      />
    </div>
  );
}
