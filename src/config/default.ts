import { AppConfig } from "./types";

export const defaultAppConfig: AppConfig = {
  interval: 60 * 1000, // Default interval: 10s
  theme: 'light',
  ai: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3.1",
  },
  plugins: [
    {
      id: "twitter-scraper",
      name: "Twitter Scraper",
      type: "scraper",
      source: "built-in",
      sandboxPath: "sandboxes/twitter_plugin.html", 
    },
    {
      id: "dexscreener-scraper",
      name: "Dexscreener Scraper",
      type: "scraper",
      source: "built-in", 
      sandboxPath: "sandboxes/dexscreener_plugin.html", 
    },
    {
      id: "fng-scraper",
      name: "Fng Scraper",
      type: "scraper",
      source: "third-party", 
      github: "github.com/algonius/example-plugin", 
    },
  ]
};