import { AIPlugin, ScraperPlugin } from "./interfaces";
import { ScraperPluginProxy } from "./scraper_plugin_proxy";
import { AIPluginProxy } from "./ai_plugin_proxy";
import { MessageProxy } from "~utils/messaging";

export class PluginManager {
  private scraperPlugins: Array<ScraperPlugin>;
  private aiPlugins: Array<AIPlugin>;
  private messageProxy: MessageProxy;

  constructor(messageProxy: MessageProxy) {
    this.scraperPlugins = new Array<ScraperPlugin>();
    this.aiPlugins = new Array<AIPlugin>();
    this.messageProxy = messageProxy;
  }

  registerPlugin(pluginData: any): void {
    if (pluginData.pluginType === "scraper") {
      // Check if a scraper plugin with the same ID already exists
      if (this.scraperPlugins.some((plugin) => plugin.id === pluginData.id)) {
        console.warn(`Scraper plugin with ID ${pluginData.id} already registered. Ignoring new registration.`);
        return; // Skip registration
      }
      this.scraperPlugins.push(new ScraperPluginProxy(this.messageProxy, pluginData.pluginID, pluginData)); 
    } else if (pluginData.pluginType === "ai") {
      // Check if an AI plugin with the same ID already exists
      if (this.aiPlugins.some((plugin) => plugin.id === pluginData.id)) {
        console.warn(`AI plugin with ID ${pluginData.id} already registered. Ignoring new registration.`);
        return; // Skip registration
      }
      this.aiPlugins.push(new AIPluginProxy(this.messageProxy, pluginData.pluginID));
    } else {
      console.warn("Unknown plugin type:", pluginData.pluginType);
    }
  }
  
  getActivePluginsOfType(type: 'ai' | 'scraper'): any[] {
    if (type == "ai") {
      return this.aiPlugins
    } else if (type == 'scraper') {
      return this.scraperPlugins
    } else {
      return []
    }
  }
}