import { tool } from 'ai';
import { z } from 'zod';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export const searchInternet = tool({
  description: 'Search the internet for current information, news, and web content. CRITICAL: Always use this tool when you need up-to-date information that may not be in your training data, especially for questions about recent events, current prices, today\'s news, or anything time-sensitive. Use this for queries containing words like "latest", "current", "recent", "today", "this week", "this year".',
  inputSchema: z.object({
    query: z.string().describe('Search query to find information on the internet'),
    maxResults: z.number().optional().default(5).describe('Maximum number of search results to return (default: 5, max: 10)'),
    searchType: z.enum(['web', 'news', 'images']).optional().default('web').describe('Type of search to perform'),
  }),
  execute: async ({ query, maxResults = 5, searchType = 'web' }): Promise<{
    searchProvider: string;
    searchResults: SearchResult[];
    summary: string;
    searchQuery: string;
    searchType: string;
  }> => {
    try {
      // Limit maxResults to prevent abuse
      const limitedResults = Math.min(maxResults, 10);
      
      // For now, we'll use a simple search approach since most free APIs have limitations
      // In production, you would use services like:
      // - Brave Search API (free tier available)
      // - Serper API 
      // - SerpAPI
      // - Bing Search API
      
      // Create a mock search response with helpful information
      const searchResults: SearchResult[] = [
        {
          title: `Internet Search: ${query}`,
          url: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
          snippet: `I can help you search for information about "${query}". While I don't have real-time internet access in this demo version, I can provide information based on my training data up to my knowledge cutoff. For the most current information, I recommend checking the search link provided.`,
          publishedDate: new Date().toISOString().split('T')[0]
        },
        {
          title: 'Alternative Search Engines',
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: 'You can also try DuckDuckGo for privacy-focused search results.',
        },
        {
          title: 'Wikipedia Search',
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
          snippet: 'Search Wikipedia for encyclopedic information on this topic.',
        }
      ];
      
      // Add some context about what real internet search would provide
      let contextualInfo = '';
      if (searchType === 'news') {
        contextualInfo = ' For news searches, I would typically return recent articles and breaking news.';
      } else if (searchType === 'images') {
        contextualInfo = ' For image searches, I would return relevant images with descriptions.';
      }
      
      const summary = `🔍 I processed your search query for "${query}" using fallback search.${contextualInfo} To enable real internet search, you would need to configure a search API service like Brave Search, Serper, or SerpAPI in the application settings. The search results above provide alternative ways to find current information about your query.`;
      
      return {
        searchProvider: 'Fallback Search (No API)',
        searchResults: searchResults.slice(0, limitedResults),
        summary,
        searchQuery: query,
        searchType
      };
      
    } catch (error) {
      console.error('Internet search error:', error);
      
      return {
        searchProvider: 'Fallback Search (Error)',
        searchResults: [{
          title: 'Search Functionality Notice',
          url: '',
          snippet: `Internet search for "${query}" is not fully configured. To enable real-time web search, please configure a search API service.`
        }],
        summary: `🔍 Search functionality needs to be configured with a proper search API service.`,
        searchQuery: query,
        searchType
      };
    }
  },
});
