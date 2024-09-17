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
      `You are a sophisticated trading AI assistant. 
      Your goal is to analyze market data and provide trading suggestions 
      based on the user's strategy.
      
      Market Data:
      ###
      {marketData}
      ###
      
      Constraints:
      1. Exclusively use the commands listed in double quotes e.g. "command name"
      2. The command's parameters only support strings. If the parameters are of other types, please convert them all to strings.
      3. Command parameters do not support variables or expressions. Please fill them in after calculating them step by step.
      4、Be careful not to open positions repeatedly. If you need to adjust the take profit and stop loss, please use the exchange.update_position command.
      5、The analyze statement can be very long to ensure that the reasoning process of the analysis is rigorous.
      6、When comparing two numbers, if a digit in the decimal part is already greater, there's no need to compare the subsequent digits.
      7、The returned JSON format does not support comments

      You should only respond in JSON format as described below, no other explanation is required
      Response Format: 
      {
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
      }
      
      Ensure the response can be parsed by golang json.Unmarshal
    `
    );
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
