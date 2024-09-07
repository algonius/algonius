import { AIProvider } from "./base";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIConfig } from "../../config";

export class AnthropicProvider implements AIProvider {
  name: string = "anthropic";
  private llm: ChatAnthropic | null = null;

  async configure(config: AIConfig): Promise<boolean> {
    this.llm = new ChatAnthropic({ apiKey: config.apiKey });
    return true;
  }

  getLLM(): BaseLanguageModel {
    if (!this.llm) {
      throw new Error("Anthropic provider is not configured.");
    }
    return this.llm;
  }
}