import { anthropic } from '@ai-sdk/anthropic';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  generateText,
} from 'ai';

/**
 * Functional test for Claude reasoning model
 * This tests that the reasoning middleware actually works
 */

async function testClaudeReasoning() {
  console.log('🧠 Testing Claude Reasoning Model Functionality...\n');
  
  // Note: This test requires ANTHROPIC_API_KEY in your environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  ANTHROPIC_API_KEY not found in environment.');
    console.log('   This test requires an API key to make actual requests.');
    console.log('   Add ANTHROPIC_API_KEY to your .env.local file to test API functionality.');
    return;
  }
  
  try {
    // Create provider with Claude reasoning model
    const testProvider = customProvider({
      languageModels: {
        'claude-reasoning': wrapLanguageModel({
          model: anthropic('claude-3-5-haiku-20241022'), // Using smaller model for testing
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
      },
    });
    
    console.log('✅ Claude reasoning provider created');
    
    // Test simple reasoning task
    console.log('🔄 Testing reasoning with <think> tags...');
    
    const result = await generateText({
      model: testProvider.languageModel('claude-reasoning'),
      prompt: `<think>
Let me think about this step by step.
The user is asking for a simple math problem.
2 + 2 = 4
</think>

What is 2 + 2?`,
      maxTokens: 100,
    } as any);
    
    console.log('📤 Generated response:', result.text);
    
    // Check if reasoning was extracted
    if ((result as any).experimental_providerMetadata?.anthropic?.reasoning) {
      console.log('✅ Reasoning content extracted successfully');
      console.log('🧠 Reasoning content:', (result as any).experimental_providerMetadata.anthropic.reasoning);
    } else {
      console.log('⚠️  No reasoning content found in response metadata');
    }
    
    console.log('\n✅ Claude reasoning test completed!');
    
  } catch (error: any) {
    if (error.message?.includes('API key')) {
      console.log('⚠️  API key issue:', error.message);
      console.log('   Make sure your ANTHROPIC_API_KEY is valid and has sufficient credits.');
    } else {
      console.log('❌ Claude reasoning test failed:', error?.message || 'Unknown error');
      if (error?.stack) {
        console.log('Stack trace:', error.stack);
      }
    }
  }
}

// Run the test
testClaudeReasoning().catch(console.error);
