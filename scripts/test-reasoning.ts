import { myProvider } from '../lib/ai/providers';

/**
 * Additional test to verify reasoning models with middleware
 */

async function testReasoningModels() {
  console.log('🧠 Testing Reasoning Models with Middleware...\n');
  
  const reasoningModels = [
    'chat-model-reasoning',
    'gpt-4o-reasoning'
  ];
  
  for (const modelName of reasoningModels) {
    try {
      const model = myProvider.languageModel(modelName);
      console.log(`Testing ${modelName}:`);
      
      // Check if it's a wrapped model (has middleware)
      if ('model' in model) {
        console.log(`  ✅ ${modelName} - Has middleware wrapper`);
        console.log(`  ✅ ${modelName} - Wrapped model type: ${(model as any).model?.constructor?.name || 'Unknown'}`);
      } else {
        console.log(`  ⚠️  ${modelName} - No middleware wrapper detected`);
      }
      
      // Test if doGenerate exists
      if (typeof model.doGenerate === 'function') {
        console.log(`  ✅ ${modelName} - Has doGenerate method`);
      } else {
        console.log(`  ❌ ${modelName} - Missing doGenerate method`);
      }
      
      console.log('');
      
    } catch (error: any) {
      console.log(`  ❌ ${modelName} - ERROR: ${error?.message || 'Unknown error'}`);
    }
  }
  
  console.log('🎯 Reasoning models test completed!');
}

testReasoningModels().catch(console.error);
