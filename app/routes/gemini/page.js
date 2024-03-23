"use client"
import React, { useState } from "react";

const Page = () => {
  const [responsedata, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = "http://localhost:3000/api/generateResponse";



  const generateQuestions = async () => {
    setLoading(true);
    try {
      const userPrompt = `You are quiz master, generate 5 easy to medium difficulty mcq questions.
Also provide the answer separately.Return an arry of objects dont use markdown.
The response should be in the following JSON format and not string:

[
  {
    "id": 0,
    "question": "",
    "options": [],
    "answer": ""
  },
  {
    "id": 1,
    "question": "",
    "options": [],
    "answer": ""
  },
  // ... (more questions)
]
`;

      const response = await fetch("/api/generateResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // get the response from the server
      const data = await response.json();
      console.log("API Response:", data);
      setResponse(data.final);
      
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(`response data: ${responsedata}`)
  return (
    <div>
      <button onClick={generateQuestions} disabled={loading}>
        {loading ? "Loading..." : "Generate Questions"}
      </button>
      {error && <p>Error: {error}</p>}
      {responsedata && responsedata.length > 0 && (
        <div>
          <h2>Response from API:</h2>
          <pre>{responsedata}</pre>
        </div>
      )}
    </div>
  );
};

export default Page;
