// src/sandboxes/twitter_plugin.ts
import { MessageProxy } from "~utils/messaging";

const messageProxy = new MessageProxy();

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

  else if (event.data.type === "response") {
    messageProxy.replyMessage(event.data);
  }
});

function sendMessage(message: any) {
  window.parent.postMessage(message, "*");
}

// Function to send HTTP request through Algonius API
async function sendHttpRequest(url: string, options: RequestInit = {}, tabUrl?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    messageProxy.sendMessageToParent({
      type: "apiCall",
      apiData: {
        path: "/http/sendHttpRequest",
        params: { url, requestOptions: options, tabUrl },
      },
    }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

// Function to scrape Twitter data for BTC news
async function scrapeTwitterData(): Promise<any> {
  try {
    const apiUrl = "https://api.twitter.com/2/tweets/search/recent?query=BTC news&max_results=5";
    const tabUrl = "https://twitter.com"; // The actual Twitter website URL
    const options = {
      headers: {
        "Authorization": "Bearer YOUR_TWITTER_API_BEARER_TOKEN",
        "Content-Type": "application/json"
      }
    };
    const response = await sendHttpRequest(apiUrl, options, tabUrl);
    
    const data = JSON.parse(response);
    return data.data.map(tweet => tweet.text);
  } catch (error) {
    console.error("Error fetching Twitter data:", error);
    throw error;
  }
}

// Function to format scraped data for AI processing
async function formatDataForAI(data: string[]): Promise<string> {
  const formattedTweets = data.map((tweet, index) => `Tweet ${index + 1}: ${tweet}`).join('\n\n');
  return `Latest BTC news from Twitter:\n\n${formattedTweets}`;
}

export const life = 42;
