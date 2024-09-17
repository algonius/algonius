// src/content.ts

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fetchRequest') {
    const { url, requestOptions, requestId } = message;

    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Send the fetched data back to the background script
        chrome.runtime.sendMessage({
          type: 'response',
          requestId,
          success: true,
          data,
        });
      })
      .catch(error => {
        // Send the error back to the background script
        chrome.runtime.sendMessage({
          type: 'response',
          requestId,
          success: false,
          error: error.message,
        });
      });

    return true; // Indicates that the response will be sent asynchronously
  }
});

export {}