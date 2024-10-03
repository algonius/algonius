import { EventEmitter } from "events";
import { AppConfig, PluginConfig } from "./config";
import { TradeSignal } from "./types";
import { Agent } from "./modules/ai-decision";
import { PluginManager, ScraperPlugin } from "./plugin";
import { MessageProxy } from "~utils/messaging";
import { APIServer } from "~apis";

export class Algonius extends EventEmitter{
  private agent: Agent;
  private timerId: NodeJS.Timeout | null = null;
  private interval: number; // Timer interval in milliseconds
  private messageProxy: MessageProxy;
  private pluginManager: PluginManager;
  private apiServer: APIServer;

  constructor(config: AppConfig) {
    super()

    this.agent = new Agent(config.ai);
    this.interval = config.interval;
    this.messageProxy = new MessageProxy();
    this.pluginManager = new PluginManager(this.messageProxy);
    this.apiServer = new APIServer(this.messageProxy);
  }

  public registerPlugin(pluginData: any): void {
    console.log("Registering plugin through Algonius:", pluginData);
    this.pluginManager.registerPlugin(pluginData);
  }

  public handlePluginReply(msg: any): void {
    console.log("Receive plugin reply message through Algonius:", msg);
    this.messageProxy.replyMessage(msg)
  }

  public handleAPICall(req: any): void {
    console.log("Receive api call through Algonius:", req);
    this.apiServer.handleRequest(req)
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
      this.emit("notify", `Algonius running at ${formattedDate}`);
      
      // Get active scrapers from the plugin manager
      const activeScrapers = this.pluginManager.getActivePluginsOfType('scraper') as ScraperPlugin[];
      console.log(`activeScrapers:`, activeScrapers);

      // Collect data from active scrapers
      const dataPromises = activeScrapers.map(scraper => scraper.scrapeData());
      const data = await Promise.all(dataPromises);

      // Format data for AI
      let processedData = "";
      for (let i = 0; i < activeScrapers.length; i++) {
        processedData += await activeScrapers[i].formatDataForAI(data[i]);
      }

      this.emit("notify", `processedData:`, processedData);
      const signal = await this.agent.generateTradeSignal(processedData)

      // Evaluate and potentially execute the trade signal
      if (signal) { // Add conditions for trade execution here (e.g., risk management)
        this.emit("notify", `generateTradeSignal:${signal}`);

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



