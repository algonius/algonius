import { AIProvider } from "./base";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIConfig } from "../../config";

export class GoogleGenAIProvider implements AIProvider {
  name: string = "google-genai";
  private llm: ChatGoogleGenerativeAI | null = null;

  async configure(config: AIConfig): Promise<boolean> {
    this.llm = new ChatGoogleGenerativeAI({ apiKey: config.apiKey });
    return true;
  }

  getLLM(): BaseLanguageModel {
    if (!this.llm) {
      throw new Error("Google GenAI provider is not configured.");
    }
    return this.llm;
  }
}