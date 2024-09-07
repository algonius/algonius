export interface AIConfig {
  provider: string; // e.g., "openai"
  apiKey?: string;

  baseUrl?: string; // Ollama base URL 
  model?: string; // Ollama model name
}

export interface AppConfig {
  interval: number; // Algonius running interval in milliseconds
  ai: AIConfig; 
}
