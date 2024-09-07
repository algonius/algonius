import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";

const predefinedIntervals = [
  { label: "5 seconds", value: 5 * 1000 },
  { label: "15 seconds", value: 15 * 1000 },
  { label: "1 minute", value: 60 * 1000 },
  { label: "5 minutes", value: 5 * 60 * 1000 },
  { label: "15 minutes", value: 15 * 60 * 1000 },
  { label: "1 hour", value: 60 * 60 * 1000 },
  { label: "4 hours", value: 4 * 60 * 60 * 1000 },
  { label: "1 day", value: 24 * 60 * 60 * 1000 },
];


function IndexOptions() {
  const [selectedInterval, setSelectedInterval] = useState<number | null>(null);
  const [customInterval, setCustomInterval] = useState("");

  const storage = new Storage();


  // Load saved interval from storage
  useEffect(() => {
    storage.get("interval").then((interval: unknown) => {
      if (interval) {
        setSelectedInterval(interval as number);
      } else {
        // Set default interval (e.g., 5 minutes)
        setSelectedInterval(5 * 60 * 1000);
      }
    });
  }, []);

  // Save interval to storage when it changes
  useEffect(() => {
    if (selectedInterval !== null) {
      storage.set("interval", selectedInterval);

      // Send message to background script to update Algonius interval
      chrome.runtime.sendMessage({
        action: "updateAlgoniusInterval",
        interval: selectedInterval,
      });
    }
  }, [selectedInterval]);

  const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInterval(parseInt(event.target.value, 10));
    setCustomInterval(""); // Clear custom interval when a predefined one is selected
  };

  const handleCustomIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomInterval(event.target.value);
    setSelectedInterval(null); // Clear selected interval when entering a custom one
  };

  const handleCustomIntervalSet = () => {
    const parsedInterval = parseInt(customInterval, 10);
    if (!isNaN(parsedInterval) && parsedInterval > 0) {
      setSelectedInterval(parsedInterval * 1000); // Convert seconds to milliseconds
    } else {
      alert("Please enter a valid positive number for the custom interval.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Algonius Settings</h2>

      <h3>Running Interval</h3>
      <select value={selectedInterval} onChange={handleIntervalChange}>
        {predefinedIntervals.map((interval) => (
          <option key={interval.value} value={interval.value}>
            {interval.label}
          </option>
        ))}
        <option value="">Custom</option> 
      </select>

      {/* Custom interval input */}
      {selectedInterval === null && ( 
        <div>
          <input
            type="number"
            value={customInterval}
            onChange={handleCustomIntervalChange}
            placeholder="Enter interval in seconds"
          />
          <button onClick={handleCustomIntervalSet}>Set</button>
        </div>
      )}

      {/* ... other settings options can be added here ... */}
    </div>
  );
}

export default IndexOptions;

