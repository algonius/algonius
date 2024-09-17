// src/apis/handlers/tabs_api_handler.ts

export class TabsAPIHandler {
  // Create a new tab
  async createTab(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.tabs.create({ url }, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab.id);
        }
      });
    });
  }

  // Delete a tab
  async deleteTab(tabId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      chrome.tabs.remove(tabId, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  // Update a tab
  async updateTab(tabId: number, updatedData: chrome.tabs.UpdateProperties): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(tabId, updatedData, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab.id);
        }
      });
    });
  }

  // Get a tab
  async getTab(tabId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab.id);
        }
      });
    });
  }

  // Handle different API requests
  async handleRequest(req: any): Promise<any> {
    const { path, params } = req;

    try {
      switch (path) {
        case '/createTab':
          const newTabId = await this.createTab(params.url);
          return { success: true, data: { tabId: newTabId } };
        case '/deleteTab':
          await this.deleteTab(params.id);
          return { success: true };
        case '/updateTab':
          const updatedTabId = await this.updateTab(params.id, params);
          return { success: true, data: { tabId: updatedTabId } };
        case '/getTab':
          const tabId = await this.getTab(params.id);
          return { success: true, data: { tabId } };
        default:
          throw new Error(`Unknown path: ${path}`);
      }
    } catch (error) {
      console.error(`Error in TabsAPIHandler: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
