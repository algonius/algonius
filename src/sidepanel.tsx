// src/sidepanel.tsx
import { useState, useEffect, useRef } from "react";
import { PluginConfig, useConfig } from "~config";
import MainPane from "~ui/components/MainPane";
import SideBar from "~ui/components/SideBar";

import "~ui/static/style.css"
import "~ui/static/index.css"

// Timeout duration in milliseconds (e.g., 20 seconds)
const RESPONSE_TIMEOUT_MS = 20000;

function IndexSidePanel() {
  const [data, setData] = useState("");
  const config = useConfig();
  const iframeRefs = useRef<{ [id: string]: HTMLIFrameElement }>({});

  useEffect(() => {
    // Add a message listener for messages from plugin iframes
    window.addEventListener("message", (event) => {
      // Check if the message is a "register" message
      if (event.data.type === "register") {
        // Forward the register message to the background script
        chrome.runtime.sendMessage({
          type: "pluginRegistered",
          pluginData: event.data,
        });
      }

      // Listen for responses from plugin iframes
      else if (event.data.type === "response") {
        console.log("sidepanel receive event from iframe:", event);

        // Forward the register message to the background script
        chrome.runtime.sendMessage(event.data);
      }

      // Handle apiCall messages from plugin iframes
      else if (event.data.type === "apiCall") {
        console.log("sidepanel receive apiCall from iframe:", event);
        // Forward the apiCall to the background script
        chrome.runtime.sendMessage(event.data);
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("sidepanel recive message:", message, "sender:", sender);

      if (message.type === "pluginRequest") {
        const pluginId = message.pluginId;
        const iframe = iframeRefs.current[pluginId];
  
        if (iframe && iframe.contentWindow) {
          // Forward the message to the plugin iframe
          iframe.contentWindow.postMessage(message, "*")
        } else {
          console.error(`Plugin iframe not found for ID: ${pluginId}`);
        }
      } else if (message.type === "apiCallResponse") {
        // Handle apiCall response from background script
        const { requestId, pluginId, ...responseData } = message;
        const iframe = iframeRefs.current[pluginId];

        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "response",
            id: requestId,
            ...responseData
          }, "*");
        } else {
          console.error(`Plugin iframe not found for ID: ${pluginId}`);
        }
      } else {
        console.error(`Not support message type:`, message.type);
        sendResponse({ success: false, error: `Not support message type ${message.type}` });
      }
    });

    // Fetch the list of plugins (replace with your actual plugin loading logic)
    const builtInPlugins = config.plugins.filter(
      (plugin) => plugin.source === "built-in"
    ) as PluginConfig[];

    builtInPlugins.forEach((plugin) => {
      // Create an iframe for each plugin
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = plugin.sandboxPath; // Path to the sandbox HTML
      iframe.id = plugin.id; // Set the iframe ID for later communication

      // Listen for the iframe's load event
      iframe.addEventListener("load", () => {
        // Send the init message after the iframe has loaded
        iframe.contentWindow?.postMessage({ type: "init", pluginID: plugin.id }, "*");
      });

      document.body.appendChild(iframe);

      // Store the iframe reference
      iframeRefs.current[plugin.id] = iframe;
    });

    // Fetch the list of plugins (replace with your actual plugin loading logic)
    const thirdPartyPlugins = config.plugins.filter(
      (plugin) => plugin.source === "third-party"
    ) as PluginConfig[];

    thirdPartyPlugins.forEach((plugin) => {
      // Create an iframe for each plugin
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "sandboxes/plugin_sandbox.html"; // Path to the sandbox HTML
      iframe.id = plugin.id; // Set the iframe ID for later communication

      // Listen for the iframe's load event
      iframe.addEventListener("load", () => {
        // Send the loadPlugin message after the iframe has loaded
        iframe.contentWindow?.postMessage(
          { type: "loadPlugin", pluginID: plugin.id, url: plugin.scriptUrl },
          "*"
        );
      });

      document.body.appendChild(iframe);

      // Store the iframe reference
      iframeRefs.current[plugin.id] = iframe;
    });

    // Clean up iframes when the component unmounts
    return () => {
      Object.values(iframeRefs.current).forEach((iframe) => {
        document.body.removeChild(iframe);
      });
    };
  }, [config]);

  return (
    <div className="flex h-screen"> 
      <MainPane /> 
      <SideBar /> 
    </div>
  );
}

export default IndexSidePanel;
