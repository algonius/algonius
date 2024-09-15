import { AIProvider } from './base'
import { OpenAIProvider } from './openai'
import { AnthropicProvider } from "./anthropic";
import { GoogleGenAIProvider } from "./google-genai";
import { GroqProvider } from "./groq";
import { OllamaProvider } from "./ollama";

// Factory function to create AI providers based on configuration
export function createAIProvider(type: String): AIProvider {
  switch (type) {
    case "openai":
      const openaiProvider = new OpenAIProvider();
      return openaiProvider;
    case "anthropic":
      const anthropicProvider = new AnthropicProvider();
      return anthropicProvider;
    case "google-genai":
      const googleGenAIProvider = new GoogleGenAIProvider();
      return googleGenAIProvider;
    case "groq":
      const groqProvider = new GroqProvider();
      return groqProvider;
    case "ollama":
      const ollamaProvider = new OllamaProvider();
      return ollamaProvider;
    default:
      throw new Error(`Unsupported AI provider: ${type}`);
  }
}