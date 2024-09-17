// src/sidepanel.tsx
import { useState, useEffect, useRef } from "react";
import { PluginConfig, useConfig } from "~config";

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
        chrome.runtime.sendMessage({
          type: "pluginResponse",
          pluginData: event.data,
        });
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}
    >
      <h2>
        Welcome to your
        <a href="https://www.plasmo.com" target="_blank"> Plasmo </a>
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank"> View Docs </a>

      {/* Display iframe IDs for debugging */}
      <h3>Loaded Plugin Iframes:</h3>
      <ul>
        {Object.keys(iframeRefs.current).map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
}

export default IndexSidePanel;
