import React, { useState, useEffect } from "react";

function IndexPopup() {
  const [runningStatus, setRunningStatus] = useState("unknown"); // Initial status

  // Function to send a message to the background script
  const sendMessageToBackground = (action: string) => {
    chrome.runtime.sendMessage({ action }, (response) => {
      if (response && response.success) {
        console.log(`${action} request sent successfully.`);
      } else {
        console.error(`Error sending ${action} request.`);
      }
    });
  };

  // Handle Start button click
  const handleStart = () => {
    sendMessageToBackground("startAlgonius");
    setRunningStatus("running");
  };

  // Handle Stop button click
  const handleStop = () => {
    sendMessageToBackground("stopAlgonius");
    setRunningStatus("stopped");
  };

  // Get initial running status from background script
  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getAlgoniusStatus" }, (response) => {
      if (response && response.status) {
        setRunningStatus(response.status);
      } else {
        console.error("Error getting Algonius status.");
      }
    });
  }, []);


  // Handle Settings button click
  const handleSettings = () => {
    // Open options page in a new tab
    chrome.runtime.openOptionsPage(); 
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Algonius</h2>
      <p>Status: {runningStatus}</p>
      {/* Conditionally render buttons based on running status */}
      {runningStatus === "stopped" && (
        <button onClick={handleStart}>Start</button>
      )}
      {runningStatus === "running" && (
        <button onClick={handleStop}>Stop</button>
      )}

      <button onClick={handleSettings}>Settings</button> 
    </div>
  );
}

export default IndexPopup;