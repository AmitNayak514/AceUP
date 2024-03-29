"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase.config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRecoilState } from "recoil";
import { questionsState, userAnswerState } from "@/app/atom/questionsatom";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalquestion, globalsetQuestions] = useRecoilState(questionsState);
  const [globaluserAnswers, globalsetUserAnswers] =
    useRecoilState(userAnswerState);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const { user } = useUser();
  const apiUrl = "http://localhost:3000/api/generateResponse";
  // console.log(user);
  const generateQuestions = async () => {
    setLoading(true);
    try {
      const userPrompt = `You are quiz master, generate 15 easy to medium difficulty mcq questions. of DSA , DBMS and Networking.
        Also provide the answer separately. Return an array of objects don't use markdown.The options of one question should not match strictly with any other options and there should only be four options
        The response should be in the following JSON format and not string  it should be strictly as per the format:
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
      // console.log("API Response:", data);

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

  const assessScore = async () => {
    let score = 0;
    questions.forEach((question) => {
      if (question.answer === userAnswers[question.id]) {
        score++;
      }
    });

    try {
      const userRef = await setDoc(doc(db, "users", user.id), {
        id: user.id,
        imageUrl: user.imageUrl,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        initialTest: true,
        tests: [
          {
            questions: questions.map((question) => ({
              qid: question.id,
              timestamp: Date.now(),
              questionText: question.question,
              options: question.options,
              chosenOption: userAnswers[question.id],
              correctAnswer: question.answer,
            })),
          },
        ],
      });
      console.log("added to firebase");
    } catch (error) {
      console.log("Error while storing data", error);
    }
    // setShowFeedback(true);
    globalsetQuestions(questions);
    globalsetUserAnswers(userAnswers);
    console.log("Score:", score);
    console.log("Total Questions:", questions.length);
    router.push("/assesment");
  };


  return (
    <div className="p-12">
      <div className="shadow-2xl bg-white rounded-3xl p-16 ">
        <div className={questions.length > 0 ? "inline" : "hidden"}>
          <h1
            style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.1)" }}
            className="text-8xl font-bold mb-3 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            AceUP
          </h1>
          <p className="mb-8 text-3xl text-[#995dda] font-bold text-center">
            Welcome to the Quiz <br /> Please answer the following questions:
          </p>
        </div>
        <div
          className={
            questions.length > 0
              ? "hidden"
              : "flex  flex-col items-center justify-center"
          }
        >
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Welcome to AceUP Diagnostic Test
          </h1>
          <p className="text-lg text-left font-medium text-[#333]/75">
            This diagnostic test is designed to assess your current knowledge
            and skills in DSA, DBMS, and Networking. By taking this test, you
            will receive valuable insights into areas where you excel and areas
            that may require improvement.
            <br />
            The test consists of 15 multiple-choice questions ranging from easy
            to medium difficulty. Please answer each question to the best of
            your ability, as this will help us tailor your learning experience
            and provide targeted recommendations for your growth.
          </p>
          <button
            onClick={generateQuestions}
            disabled={loading}
            className="mt-4 text-2xl bg-gradient-to-br hover:from-[#fff] hover:to-[#fff]/10 hover:shadow-2xl hover:shadow-black/50 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-8 py-6 font-bold tracking-wider rounded-lg"
          >
            {loading ? "Loading..." : "Start Diagnostic Test"}
          </button>
        </div>

        {error && <p>Error: {error}</p>}
        {questions?.length > 0 && (
          <div>
            {questions.map((question, index) => (
              <div key={question.id} className="">
                <h1 className=" font-bold text-[#333333]/95 text-xl mb-2">
                  {index + 1}. {question.question}
                </h1>
                {question.options.map((option, index) => (
                  <div
                    key={option}
                    className="mb-3 transition duration-300 shadow-lg shadow-[#6c4298] hover:bg-[#fff]/80 hover:text-black hover:scale-[1.025rem] text-white bg-[#8854c0] rounded-lg font-semibold px-3 py-1.5 cursor-pointer border-[3px] border-solid border-[#8854c0] hover:border-[#fff]/80"
                  >
                    <input
                      type="radio"
                      id={option}
                      name={question.id}
                      value={option}
                      onChange={handleOptionChange}
                      checked={userAnswers[question.id] === option}
                      required
                      className="hidden w-full"
                    />
                    {/* <label htmlFor={option} >{option}</label> */}
                    <label
                      htmlFor={option}
                      className="inline-block w-full rounded-md px-4 py-2 cursor-pointer"
                    >
                      <span className="inline-block">
                        {String.fromCharCode(65 + index)}.{" "}
                      </span>
                      <span className="inline-block ml-1">{option}</span>
                      {userAnswers[question.id] === option && (
                        <span className="inline-block align-middle ml-2 font-bold text-green-500">
                          <Check />
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <Button
              // variant={"premium"}
              onClick={() => {
                setIsTestCompleted(true);
                assessScore();
              }}
              className="mt-4 text-2xl bg-gradient-to-br hover:from-[#fff] hover:to-[#fff]/10 hover:shadow-2xl hover:shadow-black/75 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-8 py-6 font-bold tracking-wider rounded-lg"
            >
              CHECK SCORE
            </Button>
          </div>
        )}
        {showFeedback && renderFeedback()}
      </div>
    </div>
  );
};

export default Page;
