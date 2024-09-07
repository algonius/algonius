import { BaseLanguageModel } from "@langchain/core/language_models/base";

// Interface for AI providers 
export interface AIProvider {
  name: string;
  configure: (config: any) => Promise<boolean>;
  getLLM: () => BaseLanguageModel; // Method to get the LLM instance
  // ... other AIGC functions can be added here (e.g., generateText, etc.)
}