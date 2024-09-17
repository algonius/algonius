// src/plugins/ai_plugin_proxy.ts

import { AIPlugin } from "./interfaces";
import { TradeSignal } from "../types";
import { MessageProxy } from "~utils/messaging";

export class AIPluginProxy implements AIPlugin {
  private messageProxy: MessageProxy;

  id: string;

  constructor(messageProxy: MessageProxy, id: string) {
    this.messageProxy = messageProxy;
    this.id = id;
  }

  async generateTradeSignal(marketData: string, timeoutMs: number = 5000): Promise<TradeSignal> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(2);
  
      // Send the request to the sidepanel
      this.messageProxy.sendMessage(
        {
          type: "pluginRequest",
          pluginId: this.id,
          requestId: requestId,
          action: "generateTradeSignal",
          data: marketData,
        },
        // Use sendResponse to handle the response
        (response) => {
          console.log("AIPluginProxy receive response:", response);

          if (response.success) {
            resolve(response.data as TradeSignal);
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }
}
