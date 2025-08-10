# Search Provider Indicators and OpenAI Model Improvements

## Issues Fixed

### 1. Schema Validation Error (400 Bad Request)

**Problem**: When selecting OpenAI models (GPT-4o, GPT-4o-mini, etc.), the API returned a 400 Bad Request error with a toast message.

**Root Cause**: The API schema validation in `/app/(chat)/api/chat/schema.ts` only allowed `'chat-model'` and `'chat-model-reasoning'` but didn't include OpenAI model IDs.

**Fix**: Updated the schema to include all available OpenAI models:

```typescript
selectedChatModel: z.enum([
  'chat-model',
  'chat-model-reasoning',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-4o-reasoning'
]),
```

### 2. Missing Search Provider Visual Indicators

**Problem**: Users couldn't see which search provider was being used (Brave, DuckDuckGo, etc.).

**Solution**:

- Created a new `SearchResults` component with provider-specific logos and indicators
- Added search tool handlers to the message component
- Updated TypeScript types to include search tools

**Features**:

- **Brave Search**: Orange "B" logo with "Brave Search" label
- **DuckDuckGo**: Duck emoji with orange "DuckDuckGo" label
- **Fallback Search**: Search icon with "Web Search" label
- Loading states with animated indicators
- Search query display and result summaries

### 3. Improved OpenAI Model Search Tool Usage

**Problem**: OpenAI models were less likely to use search tools compared to Anthropic models.

**Improvements**:

- Enhanced tool descriptions with explicit instructions for when to search
- Updated system prompt to be more directive about using search tools
- Added specific keywords that should trigger searches: "latest", "current", "recent", "today", etc.

## New Files Added

### `/components/search-results.tsx`

A React component that displays search results with provider-specific styling:

- Provider logos and branding
- Search result cards with titles, URLs, and snippets
- Loading states and error handling
- Responsive design

## Files Modified

### `/app/(chat)/api/chat/schema.ts`

- Added OpenAI model IDs to the validation schema

### `/components/message.tsx`

- Added import for SearchResults component
- Added handlers for `tool-searchWeb`, `tool-searchInternet`, and `tool-searchWebBrave`
- Proper TypeScript handling for different search tool return types

### `/lib/types.ts`

- Added search tool imports and type definitions
- Extended ChatTools interface to include search tools

### `/lib/ai/tools/search-web.ts`

- Enhanced description with explicit instructions for OpenAI models

### `/lib/ai/tools/search-web-brave.ts`

- Enhanced description with specific trigger keywords

### `/lib/ai/tools/search-internet.ts`

- Enhanced description with directive language

### `/lib/ai/prompts.ts`

- Updated regularPrompt with specific guidelines for when to use search tools
- Added explicit keywords that should trigger searches

## How to Test

### 1. Test OpenAI Model Selection

1. Open the app at http://localhost:3001
2. Click the model selector dropdown
3. Select any OpenAI model (GPT-4o, GPT-4o-mini, etc.)
4. Verify no error toast appears
5. Send a message to confirm the model works

### 2. Test Search Provider Indicators

1. Select either an Anthropic or OpenAI model
2. Ask a question that should trigger a search, such as:
   - "What's the latest news about AI?"
   - "What's the current price of Bitcoin?"
   - "What happened today in tech?"
   - "Recent developments in space exploration"
3. Look for the search provider indicator that appears before the results
4. Verify you can see which provider was used (Brave, DuckDuckGo, etc.)

### 3. Test OpenAI Search Tool Usage

1. Select an OpenAI model (GPT-4o, GPT-4o-mini, etc.)
2. Ask questions with time-sensitive keywords:
   - "latest news"
   - "current events"
   - "today's weather"
   - "recent updates"
3. Verify that the model now uses search tools more consistently

## Visual Indicators

When search tools are called, you'll see:

1. **Loading State**: Animated search icon with "Searching the web..." text
2. **Brave Search**: Orange "B" logo with gradient background
3. **DuckDuckGo**: Duck emoji with orange circular background
4. **Fallback Search**: Generic search icon with blue/purple gradient

Each search result card shows:

- Search provider logo and name
- Search query (if available)
- Result summary
- Individual search results with titles, URLs, and snippets
- Publication dates (when available)

## Environment Requirements

Make sure you have the following environment variables set in `.env.local`:

- `OPENAI_API_KEY`: For OpenAI models to work
- `BRAVE_SEARCH_API_KEY`: For Brave Search to work (optional, will fall back to other providers)

## Notes

- The search tool improvements make OpenAI models more proactive about searching
- All models now have access to the same search tools
- Search results are now visually distinct and properly branded
- The fix resolves the 400 error that was preventing OpenAI model usage
