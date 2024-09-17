// src/plugins/scraper_plugin_proxy.ts

import { ScraperPlugin } from "./interfaces";
import { MessageProxy } from "~utils/messaging";

export class ScraperPluginProxy implements ScraperPlugin {
  private messageProxy: MessageProxy;

  id: string;
  name: string;
  type: string;
  source: string;

  constructor(messageProxy: MessageProxy, pluginID: string, pluginData: any) {
    this.messageProxy = messageProxy;

    this.id = pluginID;
    this.name = pluginData.name;
    this.type = pluginData.type;
    this.source = pluginData.source;
  }


  async scrapeData(timeoutMs: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(2);
  
      // Send the request to the sidepanel
      this.messageProxy.sendMessage(
        {
          type: "pluginRequest",
          pluginId: this.id,
          requestId: requestId,
          action: "scrapeData",
        },
        // Use sendResponse to handle the response
        (response) => {
          console.log("ScraperPluginProxy receive response:", response);

          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }
  
  async formatDataForAI(rawData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(2);
  
      // Send the request to the sidepanel
      this.messageProxy.sendMessage(
        {
          type: "pluginRequest",
          pluginId: this.id,
          requestId: requestId,
          action: "formatDataForAI",
          data: rawData,
        },
        // Use sendResponse to handle the response
        (response) => {
          console.log("ScraperPluginProxy receive response:", response);

          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }

}
