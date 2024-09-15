import { AppConfig, PluginConfig } from "./config";
import { TradeSignal } from "./types";
import { Agent } from "./modules/ai-decision";
import { PluginManager, ScraperPlugin } from "./plugins";

export class Algonius {
  private agent: Agent;
  private timerId: NodeJS.Timeout | null = null;
  private interval: number; // Timer interval in milliseconds
  private pluginManager: PluginManager;

  constructor(config: AppConfig) { // Default interval: 5 minutes
    this.agent = new Agent(config.ai);
    this.interval = config.interval;
    this.pluginManager = new PluginManager();
  }

  // Trade Execution Module (Placeholder)
  private async executeTrade(signal: TradeSignal): Promise<void> {
    // TODO: Implement trade execution logic
    console.log("Executing trade:", signal);
    return Promise.resolve();
  }

  // Core logic that runs at each timer interval
  private async run(): Promise<void> {
    try {
      const now = new Date();
      const formattedDate = now.toLocaleString('zh-CN', { hour12: false });
      console.log(`Algonius running at ${formattedDate}`);
      
      // Get active scrapers from the plugin manager
      const activeScrapers = this.pluginManager.getActivePluginsOfType('scraper') as ScraperPlugin[];
      console.log(`activeScrapers:`, activeScrapers);

      // Collect data from active scrapers
      const dataPromises = activeScrapers.map(scraper => scraper.scrapeData());
      const data = await Promise.all(dataPromises);

      // Format data for AI
      let processedData = "";
      for (let i = 0; i < activeScrapers.length; i++) {
        processedData += activeScrapers[i].formatDataForAI(data[i]);
      }

      const signal = await this.agent.generateTradeSignal(processedData)

      // Evaluate and potentially execute the trade signal
      if (signal) { // Add conditions for trade execution here (e.g., risk management)
        await this.executeTrade(signal);
      }
    } catch (error) {
      console.error("Error in timer function:", error);
    }
  }

  // Start the system
  public async start(): Promise<void>  {
    try {
      await this.agent.start(); // Start the AI agent

      if (this.timerId === null) {
        this.timerId = setInterval(this.run.bind(this), this.interval);
        console.log("Algonius started.");
      }
    } catch (error) {
      console.error("Error starting Algonius:", error);
    }
  }

  // Stop the system
  public stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
      console.log("Algonius stopped.");
    }

    this.agent.stop(); // Stop the AI agent
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
