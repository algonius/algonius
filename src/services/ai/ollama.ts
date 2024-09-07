import { AIProvider } from "./base";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatOllama } from "@langchain/ollama";
import { AIConfig } from "../../config";

export class OllamaProvider implements AIProvider {
  name: string = "ollama";
  private llm: ChatOllama | null = null;

  async configure(config: AIConfig): Promise<boolean> {
    this.llm = new ChatOllama({
      baseUrl: config.baseUrl, // The base URL of your Ollama server
      model: config.model, // The name of the Ollama model to use
    });
    return true;
  }

  getLLM(): BaseLanguageModel {
    if (!this.llm) {
      throw new Error("Ollama provider is not configured.");
    }
    return this.llm;
  }
}