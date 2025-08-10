import { tool } from 'ai';
import { z } from 'zod';

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published?: string;
  favicon?: string;
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
  news?: {
    results: BraveSearchResult[];
  };
}

export const searchWebBrave = tool({
  description: 'Search the web for current information using Brave Search API. Use this tool whenever you need recent, up-to-date information that may not be in your training data, including current events, news, prices, weather, or any recent developments. Always use this for questions about "latest", "current", "recent", "today", "this year", etc.',
  inputSchema: z.object({
    query: z.string().describe('Search query to find information on the internet'),
    maxResults: z.number().optional().default(5).describe('Maximum number of search results to return (default: 5, max: 10)'),
    freshness: z.enum(['pd', 'pw', 'pm', 'py']).optional().describe('Freshness filter: pd=past day, pw=past week, pm=past month, py=past year'),
    searchType: z.enum(['web', 'news']).optional().default('web').describe('Type of search: web for general results, news for recent news'),
  }),
  execute: async ({ query, maxResults = 5, freshness, searchType = 'web' }) => {
    try {
      const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;
      
      if (!braveApiKey) {
        return {
          searchProvider: 'Brave Search API (Not Configured)',
          searchResults: [{
            title: 'Search API Configuration Required',
            url: '',
            snippet: `To enable real-time web search, please add your BRAVE_SEARCH_API_KEY to your environment variables. You can get a free API key from https://brave.com/search/api/`,
            type: 'configuration'
          }],
          summary: '🔍 Web search requires Brave Search API key configuration.',
          hasRealResults: false
        };
      }
      
      // Build the API URL
      const baseUrl = 'https://api.search.brave.com/res/v1';
      const endpoint = searchType === 'news' ? 'news' : 'web';
      const params = new URLSearchParams({
        q: query,
        count: Math.min(maxResults, 10).toString(),
        safesearch: 'moderate',
        text_decorations: 'false',
        search_lang: 'en',
        country: 'US',
        result_filter: searchType === 'news' ? 'news' : 'web',
      });
      
      if (freshness) {
        params.append('freshness', freshness);
      }
      
      const searchUrl = `${baseUrl}/${endpoint}/search?${params}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': braveApiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
      }
      
      const data: BraveSearchResponse = await response.json();
      
      // Extract results based on search type
      const results = searchType === 'news' ? data.news?.results : data.web?.results;
      
      if (!results || results.length === 0) {
        return {
          searchProvider: 'Brave Search API',
          searchResults: [{
            title: 'No Results Found',
            url: '',
            snippet: `No search results were found for "${query}". Try different keywords or check your spelling.`,
            type: 'no_results'
          }],
          summary: `🔍 No results found for "${query}" using Brave Search.`,
          hasRealResults: false
        };
      }
      
      // Format results
      const searchResults = results.slice(0, maxResults).map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.description,
        publishedDate: result.published,
        type: searchType
      }));
      
      const summary = `🔍 Found ${searchResults.length} ${searchType} results for "${query}" using Brave Search API. ${
        freshness ? `Results filtered to ${freshness === 'pd' ? 'past day' : freshness === 'pw' ? 'past week' : freshness === 'pm' ? 'past month' : 'past year'}.` : ''
      }`;
      
      return {
        searchProvider: 'Brave Search API',
        searchResults,
        summary,
        hasRealResults: true,
        searchQuery: query,
        searchType
      };
      
    } catch (error) {
      console.error('Brave Search API error:', error);
      
      return {
        searchProvider: 'Brave Search API (Error)',
        searchResults: [{
          title: 'Search Error',
          url: '',
          snippet: `An error occurred while searching for "${query}": ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error'
        }],
        summary: `🔍 Brave Search failed due to an error.`,
        hasRealResults: false
      };
    }
  },
});
