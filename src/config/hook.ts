// src/config/hook.ts
import { useState, useEffect } from "react";
import { AppConfig } from "./types";
import { defaultAppConfig } from "./default";
import { Storage, StorageAreaName } from "@plasmohq/storage";

const storage = new Storage({
  area: "local"
});

export const useConfig = (): [AppConfig, (patch: Partial<AppConfig>) => void] => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);

  useEffect(() => {
    const loadConfigFromStorage = async () => {
      try {
        const loadedConfigText: string = await storage.get("appConfig");
        console.log("loadConfigFromStorage:", loadedConfigText)
        const loadedConfig = JSON.parse(loadedConfigText)
        setConfig({ ...defaultAppConfig, ...loadedConfig });
      } catch (error) {
        console.error("Error loading config from storage:", error);
      }
    };

    const watchConfigChanges = () => {
      storage.watch({
        "appConfig": (change: chrome.storage.StorageChange, _area: StorageAreaName)=>{
          const loadedConfig = JSON.parse(change.newValue)
          setConfig({ ...defaultAppConfig, ...loadedConfig });
        }
      });
    };

    loadConfigFromStorage();
    watchConfigChanges();
  }, []);

  const updateConfig = (patch: Partial<AppConfig>) => {
    const mergeConfig  = { ...config, ...patch };
    setConfig(mergeConfig);
    saveConfigToStorage(mergeConfig); // Save updated config to storage
  };

  const saveConfigToStorage = async (config: AppConfig) => {
    try {
      const configText = JSON.stringify(config);
      console.log("saveConfigToStorage:", configText)
      await storage.set("appConfig", configText);
    } catch (error) {
      console.error("Error saving config to storage:", error);
      await storage.set("appConfig", "{}");
    }
  };

  return [config, updateConfig];
};
