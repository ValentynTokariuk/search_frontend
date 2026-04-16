const API_BASE = "http://localhost:4000";

export interface SearchResult {
  pmid: string;
  title: string;
  abstract: string;
  pubYear: number;
  score: number;
  matchedTermCount?: number;
  snippet?: string;
}

export interface BM25Response {
  query: string;
  processedTerms: string[];
  count: number;
  scoring: {
    model: string;
    k1: number;
    b: number;
    fieldWeights: Record<string, number>;
    noAbstractPenalty: number;
    letterTitlePenalty: number;
    queryCoverageBoost: number;
    allTermsMatchBonus: number;
  };
  results: SearchResult[];
}

export interface BaselineResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

export interface HealthResponse {
  ok: boolean;
  message: string;
}

export type SearchMode = "bm25" | "baseline";

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

export async function searchBM25(
  query: string,
  limit: number,
  offset: number
): Promise<BM25Response> {
  const params = new URLSearchParams({ q: query, limit: String(limit), offset: String(offset) });
  const res = await fetch(`${API_BASE}/api/search-bm25?${params}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function searchBaseline(
  query: string,
  limit: number,
  offset: number
): Promise<BaselineResponse> {
  const params = new URLSearchParams({ q: query, limit: String(limit), offset: String(offset) });
  const res = await fetch(`${API_BASE}/api/search?${params}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}
