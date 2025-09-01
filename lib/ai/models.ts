export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Claude Sonnet 4',
    description: 'Latest Claude Sonnet 4 with advanced reasoning and capabilities',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Claude Sonnet 4 (Reasoning)',
    description: 'Enhanced reasoning capabilities with Claude Sonnet 4',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI GPT-4o with multimodal capabilities and improved performance',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Smaller, faster version of GPT-4o optimized for speed and efficiency',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Enhanced GPT-4 with improved speed and larger context window',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI GPT-4 with advanced reasoning and problem-solving capabilities',
  },
  {
    id: 'gpt-4o-reasoning',
    name: 'GPT-4o (Reasoning)',
    description: 'GPT-4o with enhanced reasoning capabilities and step-by-step thinking',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'OpenAI GPT-5 with next-level reasoning and advanced capabilities',
  }
];
