// src/modules/ai-decision/agent.ts
import { TradeSignal } from "../../types";
import { createAIProvider } from "../../services/ai";
import { AIConfig } from "../../config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AIProvider } from "~services/ai/base";

// Agent module responsible for generating trading signals
export class Agent {
  private aiConfig;
  private aiProvider: AIProvider;
  private prompt;

  constructor(aiConfig: AIConfig) {
    this.aiConfig = aiConfig;
    this.aiProvider = createAIProvider(aiConfig.provider);
    this.prompt = ChatPromptTemplate.fromTemplate(
      "You are a sophisticated trading AI assistant. Your goal is to analyze market data and provide trading suggestions based on the user's strategy.\nMarket Data:\n{marketData}\nTrading Suggestion (JSON format):"
    );
  }

  async start(): Promise<void> {
    try {
      await this.aiProvider.configure(this.aiConfig);
      console.log("AI Agent started.");
    } catch (error) {
      console.error("Error starting AI Agent:", error);
    }
  }

  stop(): void {
    console.log("AI Agent stopped.");
  }

  async generateTradeSignal(marketData: string): Promise<TradeSignal> {
    console.log("generateTradeSignal marketData:", marketData);

    const chain = this.prompt
      .pipe(this.aiProvider.getLLM())
      .pipe(new StringOutputParser());

    const response = await chain.invoke({ marketData });
    console.log("generateTradeSignal response:", response);

    const tradeSignal: TradeSignal = this.parseLLMResponse(response);

    return tradeSignal;
  }

  // Helper function to parse the LLM's response
  private parseLLMResponse(response: string): TradeSignal {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      // Return a default TradeSignal in case of error
      return {
        action: "hold",
        symbol: "",
        quantity: 0,
      };
    }
  }
}
