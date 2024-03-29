"use client";

import { userAnswerState, questionsState } from "@/app/atom/questionsatom";
import { Card } from "@/components/ui/card";
import { useRecoilState } from "recoil";

const page = () => {
  const [userAnswers] = useRecoilState(userAnswerState);
  const [questions] = useRecoilState(questionsState);

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
    </div>
  );
};

export default page;
