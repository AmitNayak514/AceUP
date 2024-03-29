"use client";

import {
  userAnswerState,
  questionsState,
  insightsState,
} from "@/app/atom/questionsatom";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Loader from "@/components/Loader";

const page = () => {
  const [userAnswers] = useRecoilState(userAnswerState);
  const [questions] = useRecoilState(questionsState);
  const [insights, setInsights] = useRecoilState(insightsState);
  const apiUrl = "http://localhost:3000/api/generateResponse";
  useEffect(() => {
    const getAssessment = async () => {
      try {
        const userPrompt = `You are a adaptive quiz learning app currently used for subjects DBMS,DSA and Networking.Based on give the performance of the student in the test, You have to anaylyze the strengths, weaknesses and capabilties of the student and also create strategies for imporvemnet of the student and also provide when he should take the next test. This is the test data of the student. Questions: ${JSON.stringify(
          questions
        )}, Student's answer: ${JSON.stringify(
          userAnswers
        )}. Give the output in JSON format. All the Object Keys Shall be arrays of strings of the points of the content. This shall be the format. This is just an example..keep the same structure:
        {
          "strengths": [
              "...","...",...
          ],
          "weaknesses": [
              "...","...","...",....
          ],
          "improvement_strategies": [
            "...","...","...",....
          ],
          "next_test_date": "..."
      }
        
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
        const jsonString = data.res.kwargs.content
          .replace(/```json/, "") // Remove opening code block indicator
          .replace(/```/, "") // Remove closing code block indicator
          .trim(); // Remove leading/trailing whitespace
        const parsedData = JSON.parse(jsonString);
        setInsights(parsedData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getAssessment();
  }, []);

  console.log("Insights:", insights);
  return (
    <div className="mt-8 mx-10 p-12 shadow-2xl rounded-3xl">
      <h2 className="text-3xl font-bold mb-4">Test Report:</h2>

      {questions &&
        questions.map((question, index) => (
          <Card key={index} className="border-none">
            <div className="mb-8 bg-white rounded-lg shadow-md p-6" key={index}>
              <p className="text-lg font-bold mb-2">{question.question}</p>
              <ul className="list-disc ml-6">
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="mb-2">
                    <span className="mr-2">{option}</span>
                    {userAnswers[question.id] === option && (
                      <span className="text-blue-500">(Your Choice)</span>
                    )}
                    {question.answer === option && (
                      <span className="text-green-500">(Correct)</span>
                    )}
                    {question.answer !== option &&
                      userAnswers[question.id] === option && (
                        <span className="text-red-500">(Incorrect)</span>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      <h1 className="text-3xl text-[#333] font-bold mt-8 mb-4">Feedback:</h1>
      {insights && Object.keys(insights).length > 0 ? (
        <div className="mt-8 p-10 shadow-lg shadow-[#6c4298]">
          <h3 className="text-xl font-bold mb-2">Strengths:</h3>
          <ul className="list-disc ml-6 mb-4">
            {insights.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
          <h3 className="text-xl font-bold mb-2">Weaknesses:</h3>
          <ul className="list-disc ml-6 mb-4">
            {insights.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
          <h3 className="text-xl font-bold mb-2">Improvement Strategies:</h3>
          <ul className="list-disc ml-6 mb-4">
            {insights.improvement_strategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
          <p className="text-xl font-bold mb-2">Next Test Recommendation:</p>
          <p>{insights.next_test_date}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default page;
