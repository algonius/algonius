import { AppConfig } from "./types"
import { defaultAppConfig } from "./default";
import { Storage } from "@plasmohq/storage";

export async function loadConfig(storage: Storage): Promise<AppConfig> {
  try {
    const loadedConfigText: string = await storage.get("appConfig");
    const loadedConfig = JSON.parse(loadedConfigText);
    return { ...defaultAppConfig, ...loadedConfig }; 
  } catch (error) {
    console.error("Error loading config from storage:", error);
    return defaultAppConfig;
  }
} 
