#!/usr/bin/env node

/**
 * Provider Verification Script
 * Tests if all AI models are correctly configured in the provider
 */

// Set test environment to use mock models
process.env.NODE_ENV = 'test';

async function verifyProviders() {
  console.log('🔍 Verifying AI Provider Configuration...\n');
  
  try {
    // Dynamic import to handle ES modules
    const { myProvider } = await import('../lib/ai/providers.js');
    
    console.log('✅ Provider imported successfully');
    
    // Test language models
    const languageModels = [
      'chat-model',
      'chat-model-reasoning',
      'title-model', 
      'artifact-model',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-4o-reasoning',
      'gpt-5'
    ];
    
    console.log('\n📋 Testing Language Models:');
    for (const modelName of languageModels) {
      try {
        const model = myProvider.languageModel(modelName);
        if (model) {
          console.log(`  ✅ ${modelName} - OK`);
        } else {
          console.log(`  ❌ ${modelName} - NOT FOUND`);
        }
      } catch (error) {
        console.log(`  ❌ ${modelName} - ERROR: ${error.message}`);
      }
    }
    
    // Test image models
    console.log('\n🖼️  Testing Image Models:');
    try {
      const imageModel = myProvider.imageModel('small-model');
      if (imageModel) {
        console.log('  ✅ small-model - OK');
      } else {
        console.log('  ❌ small-model - NOT FOUND');
      }
    } catch (error) {
      console.log(`  ❌ small-model - ERROR: ${error.message}`);
    }
    
    // Test model functionality
    console.log('\n⚡ Testing Model Functionality:');
    try {
      const testModel = myProvider.languageModel('chat-model');
      if (testModel && typeof testModel.doGenerate === 'function') {
        console.log('  ✅ Models have expected methods');
      } else {
        console.log('  ❌ Models missing expected methods');
      }
    } catch (error) {
      console.log(`  ❌ Model functionality test failed: ${error.message}`);
    }
    
    console.log('\n🎉 Provider verification completed!');
    
  } catch (error) {
    console.error('❌ Provider verification failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the verification
verifyProviders().catch(console.error);
