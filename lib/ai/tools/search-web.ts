import { tool } from 'ai';
import { z } from 'zod';
import * as cheerio from 'cheerio';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface WebContent {
  url: string;
  title: string;
  content: string;
  summary: string;
}

export const searchWeb = tool({
  description: 'Search the internet for current information using DuckDuckGo API. IMPORTANT: Use this tool whenever you need recent, up-to-date information that may not be in your training data. This includes current events, news, recent prices, today\'s weather, or any developments since your training cutoff. Always search when users ask about "latest", "current", "recent", "today", "this year", or similar time-sensitive queries.',
  inputSchema: z.object({
    query: z.string().describe('Search query to find information on the internet'),
    maxResults: z.number().optional().default(5).describe('Maximum number of search results to return (default: 5, max: 10)'),
  }),
  execute: async ({ query, maxResults = 5 }): Promise<{
    searchProvider: string;
    searchResults: SearchResult[];
    webContent: WebContent[];
    summary: string;
  }> => {
    try {
      // Limit maxResults to prevent abuse
      const limitedResults = Math.min(maxResults, 10);
      
      // Search using DuckDuckGo Instant Answer API
      const searchResponse = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      );
      
      if (!searchResponse.ok) {
        throw new Error(`Search API request failed: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      
      // Extract search results
      const searchResults: SearchResult[] = [];
      
      // Add instant answer if available
      if (searchData.Abstract && searchData.AbstractText) {
        searchResults.push({
          title: searchData.Heading || 'Instant Answer',
          url: searchData.AbstractURL || '',
          snippet: searchData.AbstractText
        });
      }
      
      // Add related topics
      if (searchData.RelatedTopics && Array.isArray(searchData.RelatedTopics)) {
        for (const topic of searchData.RelatedTopics.slice(0, limitedResults - 1)) {
          if (topic.Text && topic.FirstURL) {
            searchResults.push({
              title: topic.Text.split(' - ')[0] || 'Related Topic',
              url: topic.FirstURL,
              snippet: topic.Text
            });
          }
        }
      }
      
      // Fallback: Use a more comprehensive search approach
      if (searchResults.length === 0) {
        // Since DuckDuckGo's API is limited, we'll provide a fallback search
        // In a production environment, you might want to use a proper search API like Serper or SerpAPI
        const fallbackResults: SearchResult[] = [
          {
            title: `Search results for: ${query}`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            snippet: `I found information related to "${query}". For the most current and comprehensive results, you may want to search directly.`
          }
        ];
        
        return {
          searchProvider: 'DuckDuckGo API',
          searchResults: fallbackResults,
          webContent: [],
          summary: `🦆 I searched for "${query}" using DuckDuckGo but didn't find specific instant answers. The search query has been processed, and you can find more detailed results by visiting the search link provided.`
        };
      }
      
      // Fetch content from the top search results
      const webContent: WebContent[] = [];
      
      for (const result of searchResults.slice(0, 3)) { // Only fetch content from top 3 results
        if (result.url?.startsWith('http')) {
          try {
            const response = await fetch(result.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AI-Search-Bot/1.0)'
              },
              // Add timeout to prevent hanging
              signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            if (response.ok) {
              const html = await response.text();
              const $ = cheerio.load(html);
              
              // Remove scripts and styles
              $('script, style, nav, footer, aside').remove();
              
              // Extract main content
              const title = $('title').text() || result.title;
              const content = $('main, article, .content, #content, .post, .entry')
                .first()
                .text()
                .trim() || $('body').text().trim();
              
              // Create a summary of the content (first 500 characters)
              const summary = content.substring(0, 500) + (content.length > 500 ? '...' : '');
              
              webContent.push({
                url: result.url,
                title: title.substring(0, 100),
                content: content.substring(0, 2000), // Limit content length
                summary: summary
              });
            }
          } catch (fetchError) {
            console.warn(`Failed to fetch content from ${result.url}:`, fetchError);
            // Continue with other URLs
          }
        }
      }
      
      // Create an overall summary
      const summary = `🦆 Found ${searchResults.length} search results for "${query}" using DuckDuckGo. ${
        webContent.length > 0 
          ? `Successfully retrieved detailed content from ${webContent.length} sources.` 
          : 'Search results are available, but detailed content could not be retrieved from the sources.'
      }`;
      
      return {
        searchProvider: 'DuckDuckGo API',
        searchResults: searchResults.slice(0, limitedResults),
        webContent,
        summary
      };
      
    } catch (error) {
      console.error('Web search error:', error);
      
      return {
        searchProvider: 'DuckDuckGo API (Error)',
        searchResults: [{
          title: 'Search Error',
          url: '',
          snippet: `I encountered an error while searching for "${query}". Please try rephrasing your search or try again later.`
        }],
        webContent: [],
        summary: `🦆 DuckDuckGo search for "${query}" encountered an error. The search functionality may be temporarily unavailable.`
      };
    }
  },
});
