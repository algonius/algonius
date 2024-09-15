// src/sidepanel.tsx
import { useState, useEffect, useRef } from "react";
import { PluginConfig, useConfig } from "~config";

function IndexSidePanel() {
  const [data, setData] = useState("");
  const config = useConfig();
  const iframeRefs = useRef<{ [id: string]: HTMLIFrameElement }>({});

  useEffect(() => {
    // Fetch the list of plugins (replace with your actual plugin loading logic)
    const builtInPlugins = config.plugins.filter(
      (plugin) => plugin.source === "built-in"
    ) as PluginConfig[];

    builtInPlugins.forEach((plugin) => {
      // Create an iframe for each plugin
      const iframe = document.createElement("iframe");
      iframe.src = plugin.sandboxPath; // Path to the sandbox HTML
      iframe.id = plugin.id; // Set the iframe ID for later communication
      document.body.appendChild(iframe);

      // Store the iframe reference
      iframeRefs.current[plugin.id] = iframe;

      // Load the plugin script into the iframe
      iframe.contentWindow?.postMessage(
        { type: "init" },
        "*"
      );
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
      document.body.appendChild(iframe);

      // Store the iframe reference
      iframeRefs.current[plugin.id] = iframe;

      // Load the plugin script into the iframe
      iframe.contentWindow?.postMessage(
        { type: "loadPlugin", url: plugin.scriptUrl },
        "*"
      );
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
