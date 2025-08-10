# Web Search Setup Guide

This guide explains how to enable internet search capabilities in your AI chatbot.

## Overview

The chatbot now includes three web search tools with **search provider indicators**:

1. **`searchWeb`** - Basic web search using DuckDuckGo API (🦆 indicator)
2. **`searchInternet`** - General internet search fallback (🔍 indicator)
3. **`searchWebBrave`** - Advanced web search using Brave Search API (🔍 indicator)

### Search Provider Indicators

When web search is triggered, you'll see clear indicators showing which search solution is being used:

- **🔍 Brave Search API** - Premium search with comprehensive results
- **🦆 DuckDuckGo API** - Basic free search with limited results
- **🔍 Fallback Search (No API)** - When no search APIs are configured
- **🔍 Search Provider (Error)** - When there's an error with the search service

## Setup Instructions

### Option 1: Brave Search API (Recommended)

1. **Get a free Brave Search API key:**

   - Visit: https://brave.com/search/api/
   - Sign up for a free account
   - Get your API key (free tier includes 2,000 queries/month)

2. **Add the API key to your environment:**

   ```bash
   # Add to your .env.local file
   BRAVE_SEARCH_API_KEY=your_brave_api_key_here
   ```

3. **Restart your development server:**
   ```bash
   pnpm dev
   ```

### Option 2: Use Basic Search (No Setup Required)

The `searchWeb` tool works out of the box using DuckDuckGo's API, but provides limited results.

## How It Works

When users ask questions that require current information, the AI will automatically:

1. Detect when internet search is needed
2. Choose the appropriate search tool
3. Search for relevant information
4. **Display which search provider is being used** with clear indicators
5. Present the results in a helpful format

## Search Provider Indicators in Action

When a search is triggered, you'll see messages like:

- **"🔍 Found 5 web results for 'latest AI news' using Brave Search API"**
- **"🦆 Found 3 search results for 'weather today' using DuckDuckGo"**
- **"🔍 Search functionality needs to be configured with a proper search API service"**

This helps you understand:

- Which search service provided the results
- The quality and reliability of the information
- Whether you need to configure additional API keys for better results

## Example Queries

The AI will automatically use web search for queries like:

- "What's the latest news about [topic]?"
- "What's the current price of [stock/crypto]?"
- "What happened today in [location]?"
- "Latest updates on [current event]"
- "Current weather in [city]" (uses weather tool)

## Search Tools Details

### searchWebBrave

- **Best option** with high-quality results
- Supports news search, freshness filters
- Requires API key but has generous free tier
- Returns structured, relevant results

### searchWeb

- **Fallback option** using DuckDuckGo
- No API key required
- Limited results quality
- Good for basic searches

### searchInternet

- **Demo/placeholder** implementation
- Provides helpful context about search functionality
- Guides users to external search engines

## Troubleshooting

### "Search API Configuration Required" Message

- Add `BRAVE_SEARCH_API_KEY` to your `.env.local` file
- Restart your development server
- Verify the API key is correct

### No Search Results

- Check if your search query is specific enough
- Try different keywords
- Verify internet connectivity

### API Rate Limits

- Brave Search free tier: 2,000 queries/month
- Consider upgrading if you need more requests
- Implement caching for frequently searched topics

## Advanced Configuration

You can customize the search behavior by modifying the tools in:

- `/lib/ai/tools/search-web-brave.ts`
- `/lib/ai/tools/search-web.ts`
- `/lib/ai/tools/search-internet.ts`

## Security Notes

- Never commit API keys to version control
- Use environment variables for all API keys
- Consider implementing rate limiting for production use
- Monitor API usage to avoid unexpected charges

## Production Deployment

For production deployment:

1. Add environment variables to your hosting platform
2. Consider using multiple search APIs for redundancy
3. Implement proper error handling and logging
4. Set up monitoring for API usage and costs
