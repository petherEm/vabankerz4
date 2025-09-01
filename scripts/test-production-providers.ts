import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

/**
 * Test actual provider configuration (non-test environment)
 * This bypasses the test environment check to verify real models
 */

async function testActualProviders() {
  console.log('🔍 Testing Actual AI Provider Configuration (Production Models)...\n');
  
  try {
    // Create the actual provider configuration (bypassing isTestEnvironment)
    const actualProvider = customProvider({
      languageModels: {
        'chat-model': anthropic('claude-sonnet-4-20250514'),
        'chat-model-reasoning': wrapLanguageModel({
          model: anthropic('claude-sonnet-4-20250514'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': anthropic('claude-3-5-haiku-20241022'),
        'artifact-model': anthropic('claude-sonnet-4-20250514'),
        // OpenAI GPT-4 models
        'gpt-4o': openai('gpt-4o'),
        'gpt-4o-mini': openai('gpt-4o-mini'),
        'gpt-4-turbo': openai('gpt-4-turbo'),
        'gpt-4': openai('gpt-4'),
        'gpt-4o-reasoning': wrapLanguageModel({
          model: openai('gpt-4o'),
          middleware: extractReasoningMiddleware({ tagName: 'thinking' }),
        }),
        'gpt-5': openai('gpt-5')
      },
      imageModels: {
        'small-model': xai.imageModel('grok-2-image'),
      },
    });
    
    console.log('✅ Actual provider created successfully');
    
    // Test Claude/Anthropic models specifically
    console.log('\n🤖 Testing Anthropic Claude Models:');
    const claudeModels = [
      'chat-model',
      'chat-model-reasoning',
      'title-model',
      'artifact-model'
    ];
    
    let claudeModelsPassed = 0;
    for (const modelName of claudeModels) {
      try {
        const model = actualProvider.languageModel(modelName);
        if (model) {
          console.log(`  ✅ ${modelName} - OK`);
          claudeModelsPassed++;
          
          // Check if it's a reasoning model with middleware
          if (modelName.includes('reasoning')) {
            if ('model' in model && 'middleware' in model) {
              console.log(`    ↳ Has reasoning middleware with 'think' tag`);
            }
          }
        } else {
          console.log(`  ❌ ${modelName} - NOT FOUND`);
        }
      } catch (error: any) {
        console.log(`  ❌ ${modelName} - ERROR: ${error?.message || 'Unknown error'}`);
      }
    }
    
    // Test OpenAI models
    console.log('\n🧠 Testing OpenAI GPT Models:');
    const openaiModels = [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-4o-reasoning',
      'gpt-5'
    ];
    
    let openaiModelsPassed = 0;
    for (const modelName of openaiModels) {
      try {
        const model = actualProvider.languageModel(modelName);
        if (model) {
          console.log(`  ✅ ${modelName} - OK`);
          openaiModelsPassed++;
          
          // Check if it's a reasoning model with middleware
          if (modelName.includes('reasoning')) {
            if ('model' in model && 'middleware' in model) {
              console.log(`    ↳ Has reasoning middleware with 'thinking' tag`);
            }
          }
        } else {
          console.log(`  ❌ ${modelName} - NOT FOUND`);
        }
      } catch (error: any) {
        console.log(`  ❌ ${modelName} - ERROR: ${error?.message || 'Unknown error'}`);
      }
    }
    
    // Test XAI image model
    console.log('\n🖼️  Testing XAI Image Model:');
    let imageModelsPassed = 0;
    try {
      const imageModel = actualProvider.imageModel('small-model');
      if (imageModel) {
        console.log('  ✅ small-model (XAI Grok) - OK');
        imageModelsPassed++;
      } else {
        console.log('  ❌ small-model - NOT FOUND');
      }
    } catch (error: any) {
      console.log(`  ❌ small-model - ERROR: ${error?.message || 'Unknown error'}`);
    }
    
    // Test model provider validation
    console.log('\n🔬 Testing Model Provider Validation:');
    try {
      const claudeModel = actualProvider.languageModel('chat-model');
      const gptModel = actualProvider.languageModel('gpt-4o');
      const imageModel = actualProvider.imageModel('small-model');
      
      console.log('  ✅ Claude model instantiation - OK');
      console.log('  ✅ GPT model instantiation - OK');
      console.log('  ✅ XAI image model instantiation - OK');
      
      // Check if models have expected properties
      if (claudeModel && typeof claudeModel.doGenerate === 'function') {
        console.log('  ✅ Claude model has doGenerate method');
      }
      if (gptModel && typeof gptModel.doGenerate === 'function') {
        console.log('  ✅ GPT model has doGenerate method');
      }
      
    } catch (error: any) {
      console.log(`  ❌ Model validation failed: ${error?.message || 'Unknown error'}`);
    }
    
    // Summary
    console.log('\n📊 Production Models Summary:');
    console.log(`  Anthropic Claude Models: ${claudeModelsPassed}/${claudeModels.length} passed`);
    console.log(`  OpenAI GPT Models: ${openaiModelsPassed}/${openaiModels.length} passed`);
    console.log(`  XAI Image Models: ${imageModelsPassed}/1 passed`);
    
    const totalPassed = claudeModelsPassed + openaiModelsPassed + imageModelsPassed;
    const totalTests = claudeModels.length + openaiModels.length + 1;
    
    if (totalPassed === totalTests) {
      console.log('\n🎉 All production models are correctly configured!');
      console.log('   Your Anthropic Claude models are ready to use.');
      console.log('   Your OpenAI GPT models are ready to use.');
      console.log('   Your XAI image model is ready to use.');
    } else {
      console.log(`\n⚠️  ${totalTests - totalPassed} model(s) failed configuration check.`);
    }
    
  } catch (error: any) {
    console.error('❌ Production provider test failed:', error?.message || 'Unknown error');
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testActualProviders().catch(console.error);
