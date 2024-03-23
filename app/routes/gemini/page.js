"use client";

// import React, { useState } from "react";

// const page = () => {
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userPrompt, setUserPrompt] = useState(""); // Added for user input

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/generateResponse", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userPrompt }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       console.log(data);
//       setResponse(data.res.kwargs.content);
//       consolelog(response);// Adjusted to access model's response
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <label htmlFor="userPrompt">Enter your prompt:</label>
//       <button onClick={fetchData} disabled={loading}>
//         {loading ? "Loading..." : "Generate Response"}
//       </button>
//       {error && <p>Error: {error}</p>}
//       {response && (
//         <div>
//           <h2>Response from API:</h2>
//           <pre>{response}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default page;
import React, { useState } from "react";

const Page = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const userPrompt = `You are quiz master, generate 5 easy to medium difficulty mcq questions.
Also provide the answer separately.Return an arry of objects
The response should be in the following JSON format:

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
        body: JSON.stringify({ userPrompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Check if response is an array before setting state
      if (Array.isArray(data.res.kwargs.content)) {
        setResponse(data.res.kwargs.content);
      } else {
        setError("Invalid response format. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateQuestions} disabled={loading}>
        {loading ? "Loading..." : "Generate Questions"}
      </button>
      {error && <p>Error: {error}</p>}
      {response && response.length > 0 && (
        <div>
          <h2>Generated Questions:</h2>
          <form>
            {response.map((question, index) => (
              <div key={index}>{/* ... */}</div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
