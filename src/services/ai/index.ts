import { AIProvider } from './base'
import { OpenAIProvider } from './openai'
import { AnthropicProvider } from "./anthropic";
import { GoogleGenAIProvider } from "./google-genai";
import { GroqProvider } from "./groq";
import { OllamaProvider } from "./ollama";
import { AIConfig } from "../../config";

// Factory function to create AI providers based on configuration
export async function createAIProvider(config: AIConfig): Promise<AIProvider> {
  switch (config.provider) {
    case "openai":
      const openaiProvider = new OpenAIProvider();
      await openaiProvider.configure(config);
      return openaiProvider;
    case "anthropic":
      const anthropicProvider = new AnthropicProvider();
      await anthropicProvider.configure(config);
      return anthropicProvider;
    case "google-genai":
      const googleGenAIProvider = new GoogleGenAIProvider();
      await googleGenAIProvider.configure(config);
      return googleGenAIProvider;
    case "groq":
      const groqProvider = new GroqProvider();
      await groqProvider.configure(config);
      return groqProvider;
    case "ollama":
      const ollamaProvider = new OllamaProvider();
      await ollamaProvider.configure(config);
      return ollamaProvider;
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}