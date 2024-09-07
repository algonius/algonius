import { AIProvider } from "./base";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatOpenAI } from "@langchain/openai";
import { AIConfig } from "../../config";

export class OpenAIProvider implements AIProvider {
  name: string = "openai";
  private llm: ChatOpenAI | null = null;

  async configure(config: AIConfig): Promise<boolean> {
    this.llm = new ChatOpenAI({ openAIApiKey: config.apiKey }); 
    return true;
  }

  getLLM(): BaseLanguageModel {
    if (!this.llm) {
      throw new Error("OpenAI provider is not configured.");
    }
    return this.llm;
  }

  // You can add other AIGC functions here if needed, like generateText
}