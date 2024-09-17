// src/apis/server.ts
import { TabsAPIHandler } from './handlers/tabs_api_handler';
import { HttpProxyAPIHandler } from './handlers/http_proxy_api_handler';
import { MessageProxy } from "~utils/messaging";

export class APIServer {
  private tabsAPIHandler: TabsAPIHandler;
  private httpProxyAPIHandler: HttpProxyAPIHandler;
  private messageProxy: MessageProxy;

  constructor(messageProxy: MessageProxy) {
    this.messageProxy = messageProxy;
    this.tabsAPIHandler = new TabsAPIHandler();
    this.httpProxyAPIHandler = new HttpProxyAPIHandler(messageProxy);
  }

  // Handle different API requests
  async handleRequest(req: any): Promise<any> {
    const { path, params } = req;

    try {
      let result;
      if (path.startsWith('/tab')) {
        // Remove the prefix /tab and pass the remaining path to tabsAPIHandler
        const subPath = path.substring(4); // Remove the '/tab' prefix
        result = await this.tabsAPIHandler.handleRequest({ path: subPath, params });
      } else if (path.startsWith('/http')) {
        // Remove the prefix /http and pass the remaining path to httpProxyAPIHandler
        const subPath = path.substring(5); // Remove the '/http' prefix
        result = await this.httpProxyAPIHandler.handleRequest({ path: subPath, params });
      } else {
        throw new Error(`Unknown path: ${path}`);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error handling API request:", error);
      return { success: false, error: error.message };
    }
  }
}
