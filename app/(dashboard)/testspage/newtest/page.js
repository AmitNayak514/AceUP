"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { questionsState, userAnswerState } from "@/app/atom/questionsatom";
import { useRecoilState } from "recoil";

const page = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [previousTests, setPreviousTests] = useState([]);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreviousPerformance, setShowPreviousPerformance] = useState(false);
  const apiUrl = "http://localhost:3000/api/newtest";

  const [globalquestion, globalsetQuestions] = useRecoilState(questionsState);
  const [globaluserAnswers, globalsetUserAnswers] =
    useRecoilState(userAnswerState);

  useEffect(() => {
    const fetchPreviousTests = async () => {
      try {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.tests) {
            setPreviousTests(userData.tests);
          }
        }
      } catch (error) {
        console.error("Error fetching previous tests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchPreviousTests();
    }
  }, [user]);
  const getTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ previousTests, subject }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      const jsonString = data.response.response
        .replace(/```json/, "") // Remove opening code block indicator
        .replace(/```/, "") // Remove closing code block indicator
        .trim();
      const parsedData = JSON.parse(jsonString); // Assuming the response is already parsed

      setQuestions(parsedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    globalsetQuestions(questions);
    globalsetUserAnswers(userAnswers);
    console.log("Score:", score);
    console.log("Total Questions:", questions.length);
    router.push("/assesment");
  };

  return (
    <div className="flex justify-center items-center p-16">
      <div className="shadow-2xl bg-white rounded-3xl p-16">
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
        <div className={questions.length > 0 ? "hidden" : "inline"}>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold mb-2 text-center text-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
              AceUP
            </h1>
            <p className="text-lg mb-4 text-center">
              Select a Subject to Generate the Test
            </p>
            <div className="shadow-[#6c4298]/30 shadow-md rounded-lg">
              <select
                required
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  console.log(event.target.value);
                }}
                className="w-80 p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-0"
              >
                <option
                  className="border-[1px] border-gray-400"
                  value=""
                  disabled
                >
                  Select a Subject
                </option>
                <option value="DSA">DSA</option>
                <option value="DBMS">DBMS</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
            <Button
              disabled={subject.length === 0}
              onClick={getTest}
              className="text-2xl mt-4 bg-gradient-to-br hover:from-white hover:to-white hover:shadow-2xl hover:shadow-black/75 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-10 py-8 font-bold tracking-wider rounded-lg"
            >
              {loading ? "Loading..." : "Start Test"}
            </Button>
          </div>
        </div>
        {error && <p>Error: {error}</p>}
        {questions?.length > 0 && (
          <div>
            {questions.map((question, index) => (
              <div key={question.id} className="mb-10">
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
              className="mt-4 text-2xl bg-gradient-to-br hover:from-[#fff] hover:to-[#fff] hover:shadow-2xl hover:shadow-black/75 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-8 py-6 font-bold tracking-wider rounded-lg"
            >
              CHECK SCORE
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
