"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

interface SearchResultsProps {
  searchProvider: string;
  searchResults: SearchResult[];
  summary?: string;
  searchQuery?: string;
  isLoading?: boolean;
}

const getProviderIcon = (provider: string) => {
  if (provider.includes("Brave")) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-sm font-bold">B</span>
        </div>
        <span className="text-sm font-medium text-orange-600">
          Brave Search
        </span>
      </div>
    );
  }

  if (provider.includes("DuckDuckGo")) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-5 bg-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🦆</span>
        </div>
        <span className="text-sm font-medium text-orange-600">DuckDuckGo</span>
      </div>
    );
  }

  if (provider.includes("Fallback")) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-sm">🔍</span>
        </div>
        <span className="text-sm font-medium text-blue-600">Web Search</span>
      </div>
    );
  }

  // Default search icon
  return (
    <div className="flex items-center gap-2">
      <div className="size-5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-sm flex items-center justify-center">
        <span className="text-white text-sm">🔍</span>
      </div>
      <span className="text-sm font-medium text-gray-600">Search</span>
    </div>
  );
};

export const SearchResults = memo(function SearchResults({
  searchProvider,
  searchResults,
  summary,
  searchQuery,
  isLoading = false,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="animate-pulse size-5 bg-gray-300 rounded"></div>
          <span className="text-sm text-muted-foreground animate-pulse">
            Searching the web...
          </span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <div className="flex items-center gap-2 mb-3">
        {getProviderIcon(searchProvider)}
        {searchQuery && (
          <span className="text-sm text-muted-foreground">
            for &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {summary && (
        <div className="mb-3 p-3 bg-background/50 rounded border-l-4 border-blue-500">
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}

      <div className="space-y-3">
        {searchResults.slice(0, 5).map((result, index) => (
          <div key={index} className="group">
            <div className="flex flex-col gap-1">
              {result.url ? (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:underline line-clamp-2"
                >
                  {result.title}
                </a>
              ) : (
                <span className="text-sm font-medium text-foreground line-clamp-2">
                  {result.title}
                </span>
              )}

              {result.url && (
                <span className="text-xs text-green-600 truncate">
                  {new URL(result.url).hostname}
                </span>
              )}

              <p className="text-sm text-muted-foreground line-clamp-3">
                {result.snippet}
              </p>

              {result.publishedDate && (
                <span className="text-xs text-muted-foreground">
                  {new Date(result.publishedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {searchResults.length > 5 && (
        <div className="mt-3 text-sm text-muted-foreground">
          ... and {searchResults.length - 5} more results
        </div>
      )}
    </div>
  );
});
