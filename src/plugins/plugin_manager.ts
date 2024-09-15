import { AIPlugin, ScraperPlugin } from "./interfaces";

export class PluginManager {
  private scraperPlugins: Array<ScraperPlugin>;
  private aiPlugins: Array<AIPlugin>;

  constructor() {
    this.scraperPlugins = new Array<ScraperPlugin>();
    this.aiPlugins = new Array<AIPlugin>();
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