// src/apis/handlers/http_proxy_api_handler.ts

import { MessageProxy } from "~utils/messaging";

export class HttpProxyAPIHandler {
  private messageProxy: MessageProxy;

  constructor(messageProxy: MessageProxy) {
    this.messageProxy = messageProxy;
  }

  // Send a message to the content script to fetch a URL
  async sendHttpRequest(url: string, requestOptions: RequestInit, tabUrl?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const message = {
        type: 'fetchRequest',
        url,
        requestOptions,
        requestId: Date.now().toString(), // Unique request ID
      };

      // Use tabUrl if provided, otherwise use the request URL
      const queryUrl = tabUrl || url;

      // Find the matching tab
      chrome.tabs.query({ url: queryUrl }, (tabs) => {
        if (tabs.length > 0) {
          // Send message to the first matching tab
          const tabId = tabs[0].id;
          this.messageProxy.sendMessageToTab(tabId, message, (response) => {
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.error));
            }
          });
        } else {
          // If no matching tab found, open a new tab with tabUrl (or url if tabUrl is not provided)
          chrome.tabs.create({ url: tabUrl || url }, (newTab) => {
            const tabId = newTab.id;
            this.messageProxy.sendMessageToTab(tabId, message, (response) => {
              if (response.success) {
                resolve(response.data);
              } else {
                reject(new Error(response.error));
              }
            });
          });
        }
      });
    });
  }

  // Handle different API requests
  async handleRequest(req: any): Promise<any> {
    const { path, params } = req;

    switch (path) {
      case '/sendHttpRequest':
        try {
          const result = await this.sendHttpRequest(params.url, params.requestOptions, params.tabUrl);
          console.log("HTTP request result:", result);
          return { success: true, data: result };
        } catch (error) {
          console.error("Error sending HTTP request:", error);
          return { success: false, error: error.message };
        }
      default:
        console.error("Unknown path:", path);
        return { success: false, error: `Unknown path: ${path}` };
    }
  }
}
