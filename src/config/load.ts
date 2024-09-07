import { AppConfig } from "./types"
import { defaultAppConfig } from "./default";
import { Storage } from "@plasmohq/storage";

export async function loadConfig(storage: Storage): Promise<AppConfig> {
  try {
    const loadedConfig: unknown = await storage.get("appConfig");
    return loadedConfig ? (loadedConfig as AppConfig) : defaultAppConfig;
  } catch (error) {
    console.error("Error loading config from storage:", error);
    return defaultAppConfig;
  }
}