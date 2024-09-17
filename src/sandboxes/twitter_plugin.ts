// src/sandboxes/twitter_plugin.ts
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
      name: "Twitter Plugin", // Replace with actual plugin name
      version: "1.0.0", // Replace with actual version
      supportedActions: ["scrapeData"], // Replace with supported actions
    });
  } 
  
  // Handle requests from the sidepanel 
  else if (event.data.type === "pluginRequest" && event.data.action === "scrapeData") {
    try {
      const scrapedData = await scrapeTwitterData(); // Replace with actual scraping logic

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

// Function to simulate scraping Twitter data (replace with actual scraping logic)
async function scrapeTwitterData(): Promise<any> {
  // Simulate fetching trending topics from Twitter
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { topic: "Algonius", tweets: 1000 },
        { topic: "Crypto", tweets: 5000 },
        { topic: "Web3", tweets: 2000 },
      ]);
    }, 10); // Simulate a 10ms delay
  });
}

// Function to simulate scraping Twitter data (replace with actual scraping logic)
async function formatDataForAI(data: any): Promise<string> {
  // Simulate fetching trending topics from Twitter
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedString = data
        .map((topicData) => `Trending topic: ${topicData.topic} (Tweets: ${topicData.tweets})`)
        .join("\n");
      resolve(formattedString);
    }, 1);
  });
}
