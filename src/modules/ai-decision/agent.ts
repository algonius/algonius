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
  private jsonSchema;

  constructor(aiConfig: AIConfig) {
    this.aiConfig = aiConfig;
    this.aiProvider = createAIProvider(aiConfig.provider);
    this.prompt = ChatPromptTemplate.fromTemplate(
      `You are a sophisticated trading AI assistant. 
      Your goal is to analyze market data and generate trading signals to maximize user returns.
      
      Market Data:
      ###
      {marketData}
      ###

      Constraints:
      1、When comparing two numbers, if a digit in the decimal part is already greater, there's no need to compare the subsequent digits.
      2、The returned JSON format does not support comments

      You should only respond in JSON format as described below, no other explanation is required
      Response Format: 
      {jsonSchema}
      
      Ensure the response can be parsed by golang json.Unmarshal
    `
    );

    this.jsonSchema = `{
      "thoughts": {
          "plan": "analysis steps",
          "analyze": "step-by-step analysis",
          "detail": "output detailed calculation process",
          "reflection": "constructive self-criticism",
          "speak": "thoughts summary to say to user"
      },
      "symbol": "The symbol of the asset to trade",
      "quantity": "The quantity of the asset to trade."
      "action": "The trading action to take. Can be "buy", "sell", or "hold""
    }`
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

    const response = await chain.invoke({ marketData: marketData, jsonSchema: this.jsonSchema });
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
