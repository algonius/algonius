import { AppConfig } from "./types";

export const defaultAppConfig: AppConfig = {
  interval: 10 * 1000, // Default interval: 10s
  ai: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3.1",
  },
};