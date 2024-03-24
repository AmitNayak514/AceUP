"use client";
import React, { useState } from "react";

const Page = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  const apiUrl = "http://localhost:3000/api/generateResponse";

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const userPrompt = `You are quiz master, generate 5 easy to medium difficulty mcq questions. of DSA , DBMS and Networking.
      const response = await fetch(apiUrl
        Also provide the answer separately. Return an array of objects don't use markdown.
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

      const response = await fetch(apiUrl, {
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

      // Extracting the JSON string and removing code block indicators and whitespace
      const jsonString = data.res.kwargs.content
        .replace(/```json/, "") // Remove opening code block indicator
        .replace(/```/, "") // Remove closing code block indicator
        .trim(); // Remove leading/trailing whitespace

      console.log("JSON String:", jsonString);

      const parsedData = JSON.parse(jsonString);
      console.log("Parsed Data:", parsedData);

      setQuestions(parsedData);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (event) => {
    const questionId = parseInt(event.target.name, 10);
    setUserAnswers({ ...userAnswers, [questionId]: event.target.value });
  };

  const assessScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (question.answer === userAnswers[question.id]) {
        score++;
      }
    });

    setShowFeedback(true);
    console.log("Score:", score);
    console.log("Total Questions:", questions.length);
  };

  const renderFeedback = () => {
    return questions.map((question) => (
      <div key={question.id}>
        <p>{question.question}</p>
        <ul>
          {question.options.map((option) => (
            <li key={option}>
              {option} {userAnswers[question.id] === option && `(Your Choice)`}
              {question.answer === option && (
                <span style={{ color: "green" }}>✅ Correct</span>
              )}
              {question.answer !== option &&
                userAnswers[question.id] === option && (
                  <span style={{ color: "red" }}>❌ Incorrect</span>
                )}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div>
      <button onClick={generateQuestions} disabled={loading}>
        {loading ? "Loading..." : "Generate Questions"}
      </button>
      {error && <p>Error: {error}</p>}
      {questions?.length > 0 && (
        <div>
          {questions.map((question) => (
            <div key={question.id} className="">
              <h1>{question.question}</h1>
              {question.options.map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name={question.id}
                    value={option}
                    onChange={handleOptionChange}
                    checked={userAnswers[question.id] === option}
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={assessScore}>Check Score</button>
        </div>
      )}
      {showFeedback && renderFeedback()}
    </div>
  );
};

export default Page;
