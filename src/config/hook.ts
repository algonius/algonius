// src/config/useConfig.ts
import { useState, useEffect } from "react";
import { AppConfig } from "./types";
import { defaultAppConfig } from "./default";
import { Storage } from "@plasmohq/storage";

export const useConfig = (): AppConfig => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);

  useEffect(() => {
    const loadConfigFromStorage = async () => {
      try {
        const storage = new Storage();
        const loadedConfig: unknown = await storage.get("appConfig");
        setConfig(loadedConfig ? (loadedConfig as AppConfig) : defaultAppConfig);
      } catch (error) {
        console.error("Error loading config from storage:", error);
      }
    };

    loadConfigFromStorage();
  }, []);

  return config;
};
