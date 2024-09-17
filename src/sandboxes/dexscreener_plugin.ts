// src/sandboxes/dexscreener_plugin.ts
export const life = 42;

window.addEventListener("message", async function (event) {
  const source = event.source as {
    window: WindowProxy;
  };

  console.log("receive event:", event);

  // Handle initialization message from the parent
  if (event.data.type === "init") {
    const pluginID = event.data.pluginID;

    // Register the plugin with the parent window
    sendMessage({
      type: "register",
      pluginID: pluginID,
      pluginType: "scraper",
      name: "Dexscreener Plugin", // Replace with actual plugin name
      version: "1.0.0", // Replace with actual version
      supportedActions: ["scrapeData"], // Replace with supported actions
    });
  }

  // Handle requests from the sidepanel 
  else if (event.data.type === "pluginRequest" && event.data.action === "scrapeData") {
    try {
      const scrapedData = await scrapeDexscreenerData(); // Replace with actual scraping logic

      // Send the response back to the sidepanel
      sendMessage({
        type: "response",
        id: event.data.requestId,
        success: true,
        data: scrapedData,
      });
    } catch (error) {
      sendMessage({
        type: "response",
        id: event.data.requestId,
        success: false,
        error: error.message,
      });
    }
  }

  // Handle requests from the sidepanel 
  else if (event.data.type === "pluginRequest" && event.data.action === "formatDataForAI") {
    try {
      const scrapedData = await formatDataForAI(event.data.data); // Replace with actual scraping logic

      // Send the response back to the sidepanel
      sendMessage({
        type: "response",
        id: event.data.requestId,
        success: true,
        data: scrapedData,
      });
    } catch (error) {
      sendMessage({
        type: "response",
        id: event.data.requestId,
        success: false,
        error: error.message,
      });
    }
  }
});

function sendMessage(message: any) {
  window.parent.postMessage(message, "*");
}

// Function to simulate scraping Dexscreener data (replace with actual scraping logic)
async function scrapeDexscreenerData(): Promise<any> {
  // Simulate fetching trending pairs from Dexscreener
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { pair: "ETH/USDC", chain: "Ethereum", price: 1700, volume: 1000000 },
        { pair: "BTC/USDT", chain: "Binance Smart Chain", price: 26000, volume: 5000000 },
        { pair: "SOL/USDC", chain: "Solana", price: 25, volume: 2000000 },
      ]);
    }, 10); // Simulate a 10ms delay
  });
}

// Function to simulate scraping Dexscreener data (replace with actual scraping logic)
async function formatDataForAI(data: any): Promise<string> {
  // Simulate fetching trending pairs from Dexscreener
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedString = data
        .map((pairData) => `Trending Pair: ${pairData.pair} on ${pairData.chain} - Price: ${pairData.price}, Volume: ${pairData.volume}`)
        .join("\n");
      resolve(formattedString);
    }, 1);
  });
}
