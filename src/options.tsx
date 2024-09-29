import React, { useState, useEffect } from "react";
import { useConfig } from "~config";

import "~ui/static/style.css";
import "~ui/static/index.css";

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

const availableThemes = ["light", "dark"];

function IndexOptions() {
  const [config, saveConfig] = useConfig();

  const [selectedInterval, setSelectedInterval] = useState<number | null>(predefinedIntervals[0].value);
  const [customInterval, setCustomInterval] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(config.theme);

  // Load saved interval from storage
  useEffect(() => {
    setSelectedInterval(config.interval);
    setSelectedTheme(config.theme);
  }, [config]);

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

  const handleThemeChange = (
    theme: string
  ) => {
    console.log("Selected theme:", theme);

    setSelectedTheme(theme);

    saveConfig({
      theme: theme
    })
  };

  return (
    <div className="container mx-auto p-4">
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
            className="w-full p-2 border rounded"
            value={customInterval}
            onChange={handleCustomIntervalChange}
            placeholder="Enter interval in seconds"
          />
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCustomIntervalSet}>Set</button>
        </div>
      )}

      <h3>Theme</h3>     
      <select value={selectedTheme} onChange={(e) => handleThemeChange(e.target.value)}>
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
      
      {/* You can add a section to explain what themes mean and how to use them */}
      <p>Select your preferred theme. </p>
      
    </div>
  );
}

export default IndexOptions;
