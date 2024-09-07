import { AIProvider } from "./base";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatGroq  } from "@langchain/groq";
import { AIConfig } from "../../config";

export class GroqProvider implements AIProvider {
  name: string = "groq";
  private llm: ChatGroq | null = null;

  async configure(config: AIConfig): Promise<boolean> {
    this.llm = new ChatGroq({
      apiKey: config.apiKey,
      model: config.model
    });
    return true;
  }

  getLLM(): BaseLanguageModel {
    if (!this.llm) {
      throw new Error("Groq provider is not configured.");
    }
    return this.llm;
  }
}