export interface AIConfig {
  provider: string; // e.g., "openai"
  apiKey?: string;

  baseUrl?: string; // Ollama base URL 
  model?: string; // Ollama model name
}

export interface PluginConfig {
  id: string;
  name: string;
  type: "ai" | "scraper";
  source: "built-in" | "third-party"; 
  sandboxPath?: string;
  scriptUrl?: string; // Can be a remote URL or a GitHub repo URL with tag/branch/commit
  github?: string; // Can be a remote URL or a GitHub repo URL with tag/branch/commit
}

export interface AppConfig {
  interval: number; // Algonius running interval in milliseconds
  theme: string;
  ai: AIConfig; 
  plugins: Array<PluginConfig>
}
