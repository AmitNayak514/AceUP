"use client";
import React, { useState } from "react";

const YourComponent = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  const apiUrl = "http://localhost:3000/api/generateResponse";

  // const text ="Say hello!";

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userPrompt, // Send the updated userPrompt value
          }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        setResponse(data.text);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <input
          type="text"
          name="text"
          value={userPrompt} // Display current prompt
          onChange={(e) => setUserPrompt(e.target.value)} // Update prompt on change
        />
        <button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </button>
        {error && <p>Error: {error}</p>}
        {response && (
    <div>
      <h2>Response from API:</h2>
      <pre>{JSON.stringify(response.formattedText, null, 2)}</pre>
      {/* Optionally display other data if needed: */}
      {
        console.log(response + data + text)
      }
      {Object.keys(otherData).length > 0 && (
        <div>
          <h2>Other Data:</h2>
          <pre>{JSON.stringify(otherData, null, 2)}</pre>
        </div>
      )}
    </div>
  )}
      </div>
    );
  };

export default YourComponent;
