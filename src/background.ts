import { Algonius } from "./algonius";
import { Storage } from "@plasmohq/storage";

// Instantiate Storage
const storage = new Storage();

// Function to initialize and start Algonius
async function initializeAlgonius() {
  const interval = (await storage.get("interval")) as number | undefined;

  // Instantiate Algonius with loaded or default interval
  const algonius = new Algonius(interval ?? 5 * 60 * 1000);

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
