import { AppConfig } from "./config";
import { TradeSignal } from "./types";
import { Agent } from "./modules/ai-decision";
import { CombinedData } from "./modules/data-collection";
import { DataCollector } from "./modules/data-collection";
import { DEXScraper } from "./scrapers/dex";
import { NewsScraper } from "./scrapers/news";
import { TwitterScraper } from "./scrapers/twitter";

export class Algonius {
  private agent: Agent;
  private timerId: NodeJS.Timeout | null = null;
  private interval: number; // Timer interval in milliseconds
  private dataCollector: DataCollector;

  constructor(config: AppConfig) { // Default interval: 5 minutes
    this.agent = new Agent(config.ai);
    this.dataCollector = new DataCollector([
      new DEXScraper(), // Example: Add a DEX scraper
      new NewsScraper(), // Example: Add a news scraper
      new TwitterScraper(), // Example: Add a Twitter scraper
    ]);
    this.interval = config.interval;
  }

  // Data Collection Module
  private async collectData(): Promise<any> {
    console.log("Collecting data from various sources...");
    return this.dataCollector.collectData();
  }

  // Data Processing Module
  private async processData(data: CombinedData): Promise<string> {
    console.log("Processing data...");

    let aiFormattedData = "";

    // Add system prompt
    aiFormattedData += "## Algonius Trading System\n";
    aiFormattedData += "Analyze the following market data and suggest a trading action.\n\n";

    // Add user's trading strategy (replace with actual strategy)
    aiFormattedData += "**User's Trading Strategy:**\n";
    aiFormattedData += " - Buy when the price is below the 20-day moving average.\n";
    aiFormattedData += " - Sell when the price is above the 20-day moving average.\n\n";

    // Add data from each source
    for (const source in data) {
      aiFormattedData += `**Data from ${source}:**\n`;
      aiFormattedData += data[source].getAIFormattedData();
      aiFormattedData += "\n\n";
    }

    return aiFormattedData;
  }


  // Trade Execution Module (Placeholder)
  private async executeTrade(signal: TradeSignal): Promise<void> {
    // TODO: Implement trade execution logic
    console.log("Executing trade:", signal);
    return Promise.resolve();
  }

  private async generateTradeSignal(marketData: any): Promise<TradeSignal> {
    return this.agent.generateTradeSignal(marketData);
  }

  // Core logic that runs at each timer interval
  private async run(): Promise<void> {
    try {
      const now = new Date();
      const formattedDate = now.toLocaleString('zh-CN', { hour12: false });
      console.log(`Algonius running at ${formattedDate}`);
       
      const data = await this.collectData();
      const processedData = await this.processData(data);
      const signal = await this.generateTradeSignal(processedData);

      // Evaluate and potentially execute the trade signal
      if (signal) { // Add conditions for trade execution here (e.g., risk management)
        await this.executeTrade(signal);
      }
    } catch (error) {
      console.error("Error in timer function:", error);
    }
  }

  // Start the system
  public start(): void {
    if (this.timerId === null) {
      this.timerId = setInterval(this.run.bind(this), this.interval);
      console.log("Algonius started.");
    }
  }

  // Stop the system
  public stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
      console.log("Algonius stopped.");
    }
  }

  public isRunning(): boolean {
    return this.timerId !== null;
  }

  // Update the running interval
  public setInterval(interval: number): void {
    this.interval = interval;
    // If the system is currently running, restart the timer with the new interval
    if (this.isRunning()) {
      this.stop();
      this.start();
    }
  }
}
