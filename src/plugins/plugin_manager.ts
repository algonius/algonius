import { AIPlugin, ScraperPlugin } from "./interfaces";

export class PluginManager {
  private plugins: { [id: string]: any } = {};

  async loadPlugin(pluginUrl: string): Promise<void> {
    // Create an iframe for the plugin
    const iframe = document.createElement("iframe");
    iframe.src = "plugins/sandbox.html"; // Path to the sandbox HTML
    document.body.appendChild(iframe);

    // Send a message to the iframe to load the plugin script
    iframe.contentWindow?.postMessage({ type: "loadPlugin", url: pluginUrl }, "*");

    // Listen for messages from the iframe
    window.addEventListener("message", (event) => {
      if (event.source === iframe.contentWindow) {
        // Handle plugin messages
      }
    });
  }

  getActivePluginsOfType(type: 'ai' | 'scraper'): any[] {
    return Object.values(this.plugins).filter(plugin => plugin.type === type);
  }

  // ... other methods for unloading, enabling/disabling plugins, etc.
}