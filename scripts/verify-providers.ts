import { myProvider } from '../lib/ai/providers';

/**
 * Provider Verification Script
 * Tests if all AI models are correctly configured in the provider
 */

async function verifyProviders() {
  console.log('🔍 Verifying AI Provider Configuration...\n');
  
  try {
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
    let languageModelsPassed = 0;
    for (const modelName of languageModels) {
      try {
        const model = myProvider.languageModel(modelName);
        if (model) {
          console.log(`  ✅ ${modelName} - OK`);
          languageModelsPassed++;
        } else {
          console.log(`  ❌ ${modelName} - NOT FOUND`);
        }
      } catch (error: any) {
        console.log(`  ❌ ${modelName} - ERROR: ${error?.message || 'Unknown error'}`);
      }
    }
    
    // Test image models
    console.log('\n🖼️  Testing Image Models:');
    let imageModelsPassed = 0;
    try {
      const imageModel = myProvider.imageModel('small-model');
      if (imageModel) {
        console.log('  ✅ small-model - OK');
        imageModelsPassed++;
      } else {
        console.log('  ❌ small-model - NOT FOUND');
      }
    } catch (error: any) {
      console.log(`  ❌ small-model - ERROR: ${error?.message || 'Unknown error'}`);
    }
    
    // Test model functionality
    console.log('\n⚡ Testing Model Functionality:');
    let functionalityPassed = 0;
    try {
      const testModel = myProvider.languageModel('chat-model');
      if (testModel && typeof testModel.doGenerate === 'function') {
        console.log('  ✅ Models have expected methods');
        functionalityPassed++;
      } else {
        console.log('  ❌ Models missing expected methods');
      }
    } catch (error: any) {
      console.log(`  ❌ Model functionality test failed: ${error?.message || 'Unknown error'}`);
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`  Language Models: ${languageModelsPassed}/${languageModels.length} passed`);
    console.log(`  Image Models: ${imageModelsPassed}/1 passed`);
    console.log(`  Functionality Tests: ${functionalityPassed}/1 passed`);
    
    const totalPassed = languageModelsPassed + imageModelsPassed + functionalityPassed;
    const totalTests = languageModels.length + 1 + 1;
    
    if (totalPassed === totalTests) {
      console.log('\n🎉 All tests passed! Your AI provider configuration is correct.');
    } else {
      console.log(`\n⚠️  ${totalTests - totalPassed} test(s) failed. Please check your configuration.`);
    }
    
  } catch (error: any) {
    console.error('❌ Provider verification failed:', error?.message || 'Unknown error');
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the verification
verifyProviders().catch(console.error);
