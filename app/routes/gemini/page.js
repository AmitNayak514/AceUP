"use client";
// import React, { useState } from "react";

// const YourComponent = () => {
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const apiUrl = "http://localhost:3000/api/generateResponse";

//   const text = "";

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userPrompt: text,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       // get the response from the server
//       const data = await response.json();
//       // set the response in the state
//       console.log(data);
//       setResponse(data.text);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchData} disabled={loading}>
//         {loading ? "Loading..." : "Fetch Data"}
//       </button>
//       {error && <p>Error: {error}</p>}
//       {response && (
//         <div>
//           <h2>Response from API:</h2>
//           <pre>{JSON.stringify(response)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default YourComponent;
import React, { useState } from "react";

const YourComponent = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = "http://localhost:3000/api/generateResponse";

  const text =
    "What would be a good company name for a company that makes colorful socks?";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: text,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // get the response from the server
      const data = await response.json();
      // set the response in the state
    //   console.log(data);
      setResponse(data.text);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      {error && <p>Error: {error}</p>}
      {response && (
        <div>
          <h2>Response from API:</h2>
          <pre>{JSON.stringify(response)}</pre>
          
        </div>
      )}
    </div>
  );
};

export default YourComponent;