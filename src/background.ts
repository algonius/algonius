import { loadConfig } from './config'
import { Algonius } from "./algonius";
import { Storage } from "@plasmohq/storage";
import { config } from 'process';

// Function to initialize and start Algonius
async function initializeAlgonius() {
  // Instantiate Storage
  const storage = new Storage();
  const cfg = await loadConfig(storage)
  console.log("config:", cfg);
  
  // Instantiate Algonius with loaded or default interval
  const algonius = new Algonius(cfg);

  // Start Algonius when the extension is loaded
  algonius.start();

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
    }
  });
}

// Initialize and start Algonius when the extension is loaded
initializeAlgonius();

export {};
