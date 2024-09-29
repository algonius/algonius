import { loadConfig } from './config'
import { Algonius } from "./algonius";
import { Storage } from "@plasmohq/storage";

// Function to initialize and start Algonius
async function initializeAlgonius() {
  // Instantiate Storage
  const storage = new Storage({
    area: "local"
  });
  const cfg = await loadConfig(storage)
  console.log("config:", cfg);
  
  // Instantiate Algonius with loaded or default interval
  const algonius = new Algonius(cfg);

  // Start Algonius when the extension is loaded
  await algonius.start();

  // Add a message listener to handle start/stop and status requests
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startAlgonius") {
      algonius.start();
      sendResponse({ success: true });
    } else if (request.action === "stopAlgonius") {
      algonius.stop();
      sendResponse({ success: true });
    } else if (request.action === "getAlgoniusStatus") {
      sendResponse({ status: algonius.isRunning() ? "running" : "stopped" });
    } else if (request.action === "updateAlgoniusInterval") {
      algonius.setInterval(request.interval);
      sendResponse({ success: true });
    } else if (request.type === "pluginRegistered") {
      console.log("Plugin registered (background):", request.pluginData, "sender:", sender);
      // Forward the registration to the Algonius instance
      algonius.registerPlugin(request.pluginData); 
      sendResponse({ success: true });
    } else if (request.type === "response") {
      console.log("receive response:", request.data);

      // Forward the registration to the Algonius instance
      algonius.handlePluginReply(request.data); 
      sendResponse({ success: true });
    } else if (request.type === "apiCall") {
      console.log("Background received API call:", request.apiData);
      // Handle API call asynchronously
      algonius.handleAPICall(request.apiData).then(result => {
        // Send the API call response back to the sidepanel
        chrome.runtime.sendMessage({
          type: "apiCallResponse",
          requestId: request.apiData.requestId,
          pluginId: sender.id,
          ...result
        });
      }).catch(error => {
        chrome.runtime.sendMessage({
          type: "apiCallResponse",
          requestId: request.apiData.requestId,
          pluginId: sender.id,
          success: false,
          error: error.message
        });
      });
      // Send an immediate response to keep the message channel open
      sendResponse({ success: true });
      return true; // Indicates that the response will be sent asynchronously
    }
  });
}

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Initialize and start Algonius when the extension is loaded
initializeAlgonius();

export {};
