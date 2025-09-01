import { test, expect } from '@playwright/test';
import { myProvider } from '@/lib/ai/providers';

test.describe('AI Providers Configuration', () => {
  test('should have all expected language models configured', () => {
    // Check if provider exists
    expect(myProvider).toBeDefined();
    
    // Check for core models by trying to access them
    expect(() => myProvider.languageModel('chat-model')).not.toThrow();
    expect(() => myProvider.languageModel('chat-model-reasoning')).not.toThrow();
    expect(() => myProvider.languageModel('title-model')).not.toThrow();
    expect(() => myProvider.languageModel('artifact-model')).not.toThrow();
    
    // Check for OpenAI GPT-4 models that were added
    expect(() => myProvider.languageModel('gpt-4o')).not.toThrow();
    expect(() => myProvider.languageModel('gpt-4o-mini')).not.toThrow();
    expect(() => myProvider.languageModel('gpt-4-turbo')).not.toThrow();
    expect(() => myProvider.languageModel('gpt-4')).not.toThrow();
    expect(() => myProvider.languageModel('gpt-4o-reasoning')).not.toThrow();
    expect(() => myProvider.languageModel('gpt-5')).not.toThrow();
  });
  
  test('should have image models configured', () => {
    // Check for image model
    expect(() => myProvider.imageModel('small-model')).not.toThrow();
  });
  
  test('should return valid model instances', () => {
    // Test getting specific models
    const chatModel = myProvider.languageModel('chat-model');
    const gptModel = myProvider.languageModel('gpt-4o');
    const imageModel = myProvider.imageModel('small-model');
    
    expect(chatModel).toBeDefined();
    expect(gptModel).toBeDefined();
    expect(imageModel).toBeDefined();
    
    // Check that models have expected properties/methods
    expect(chatModel).toHaveProperty('doGenerate');
    expect(gptModel).toHaveProperty('doGenerate');
  });
  
  test('should handle reasoning models properly', () => {
    const chatReasoningModel = myProvider.languageModel('chat-model-reasoning');
    const gptReasoningModel = myProvider.languageModel('gpt-4o-reasoning');
    
    expect(chatReasoningModel).toBeDefined();
    expect(gptReasoningModel).toBeDefined();
  });
});
