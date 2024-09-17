

// Timeout duration in milliseconds (e.g., 20 seconds)
const RESPONSE_TIMEOUT_MS = 20000;

export class MessageProxy {

  private pendingResponses: { 
    [requestId: string]: { 
      sendResponse: (response: any) => void; 
      timeoutId: NodeJS.Timeout; 
    } 
  } = {};

  sendMessage(message: any, responseCallback: (response: any) => void, timeout: number = RESPONSE_TIMEOUT_MS): void {
    console.log("MessageProxy sendMessage:", message, responseCallback, timeout);

    const requestId = message.requestId;

    // Set a timeout to remove the pending response and send a timeout error
    const timeoutId = setTimeout(() => {
      delete this.pendingResponses[requestId];
      responseCallback({ success: false, error: `Timeout waiting for response` });
    }, timeout);

    // Store the sendResponse function for this request
    this.pendingResponses[requestId] = {
      sendResponse: responseCallback,
      timeoutId: timeoutId,
    };

    // Send the request to the sidepanel
    chrome.runtime.sendMessage(message);
  }

  sendMessageToTab(tabId: number, message: any, responseCallback: (response: any) => void, timeout: number = RESPONSE_TIMEOUT_MS): void {
    console.log("MessageProxy sendMessageToTab:", tabId, message, responseCallback, timeout);

    const requestId = message.requestId;

    // Set a timeout to remove the pending response and send a timeout error
    const timeoutId = setTimeout(() => {
      delete this.pendingResponses[requestId];
      responseCallback({ success: false, error: `Timeout waiting for response` });
    }, timeout);

    // Store the sendResponse function for this request
    this.pendingResponses[requestId] = {
      sendResponse: responseCallback,
      timeoutId: timeoutId,
    };

    // Send the request to the specified tab
    chrome.tabs.sendMessage(tabId, message, (response) => {
      this.replyMessage({ id: requestId, success: true, data: response });
    });
  }

  sendMessageToParent(message: any, responseCallback: (response: any) => void, timeout: number = RESPONSE_TIMEOUT_MS): void {
    console.log("MessageProxy sendMessageToParent:", message, responseCallback, timeout);

    const requestId = Date.now().toString();
    message.requestId = requestId;

    // Set a timeout to remove the pending response and send a timeout error
    const timeoutId = setTimeout(() => {
      delete this.pendingResponses[requestId];
      responseCallback({ success: false, error: `Timeout waiting for response` });
    }, timeout);

    // Store the sendResponse function for this request
    this.pendingResponses[requestId] = {
      sendResponse: responseCallback,
      timeoutId: timeoutId,
    };

    // Send the message to the parent window
    window.parent.postMessage(message, "*");
  }
  
  replyMessage(data: any) {
    console.log("MessageProxy receive reply message:", data);

    const requestId = data.id;
    const pendingResponse = this.pendingResponses[requestId];

    if (pendingResponse) {
      console.log("MessageProxy found pendingResponse:", pendingResponse, data);

      // Clear the timeout associated with this request
      clearTimeout(pendingResponse.timeoutId);

      // Call the stored sendResponse function with the response data
      pendingResponse.sendResponse({ 
        success: data.success, 
        data: data.data, 
        error: data.error 
      });

      // Remove the sendResponse function from pendingResponses
      delete this.pendingResponses[requestId];
    } else {
      console.warn(`No pending response found for request ID: ${requestId}`);
    }
  }
}