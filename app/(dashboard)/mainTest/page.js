"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { db } from "@/firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const PerformanceReport = ({ tests }) => {
  return (
    <div className="mt-8 ">
      <h2 className="text-3xl font-bold mb-4">Previous Test Performance :</h2>
      {tests.map((test, index) => (
        <Card key={index} className="mb-4  p-16">
          <h3 className="text-xl font-bold mb-3">Test {index + 1} :</h3>
          <p className="text-xl text-[#333333]/90 mb-3">
            Total Score:{" "}
            {
              test.questions.filter((q) => q.chosenOption === q.correctAnswer)
                .length
            }{" "}
            / {test.questions.length}
          </p>
          <ul>
            {test.questions.map((question, index) => (
              <div
                key={index}
                className="mb-6  shadow-[#6c4298]/60 shadow-sm p-4 rounded-lg"
              >
                <li>
                  <p className="text-lg text-[#333]/95 font-bold">
                    {question.questionText}
                  </p>
                  <ul>
                    {question.options.map((option, index) => (
                      <div key={index} className="pl-1">
                        <li className="text-base">
                          {option}
                          {question.chosenOption === option && (
                            <span className="text-blue-400">
                              {" "}
                              (Your Choice)
                            </span>
                          )}
                          {question.correctAnswer === option && (
                            <span style={{ color: "green" }}>
                              {" "}
                              (Correct Answer)
                            </span>
                          )}
                        </li>
                      </div>
                    ))}
                  </ul>
                </li>
              </div>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

const TestPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [previousTests, setPreviousTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviousPerformance, setShowPreviousPerformance] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPreviousTests();
    }
  }, [user]);
  console.log(previousTests);

  return (
    <div className="p-12">
      <div className="shadow-2xl bg-white rounded-3xl p-16">
        <div className="mb-8 space-y-4 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Welcome to AceUP Test App
            </h1>
            <p className="text-lg text-left font-medium text-[#333]/75 ">
              Welcome to your personalized adaptive testing experience. This
              platform leverages your previous test history to tailor a
              customized test that matches your current capabilities and areas
              for improvement. By adapting to your performance, we aim to
              provide a more effective and targeted learning experience.
            </p>
          </div>
          <div className="">
            <Button
              onClick={() =>
                setShowPreviousPerformance(!showPreviousPerformance)
              }
              className="mt-4 text-2xl text-center bg-gradient-to-br hover:from-[#fff] hover:to-[#fff] hover:shadow-2xl hover:shadow-black/75 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-8 py-16 font-bold tracking-wider rounded-lg"
            >
              Show Previous <br /> Performance
            </Button>
            <Button
              onClick={() => {
                setShowPreviousPerformance(false);
                router.push(`/mainTest/actualTest`);
              }}
              className="mt-4 ml-16 text-2xl bg-gradient-to-br hover:from-[#fff] hover:to-[#fff] hover:shadow-2xl hover:shadow-black/75 transition duration-300 hover:text-[#333]/90 from-zinc-900 to-zinc-700 text-white px-8 py-16 font-bold tracking-wider rounded-lg"
            >
              Start a new <br /> Test
            </Button>
          </div>
        </div>
        {showPreviousPerformance && <PerformanceReport tests={previousTests} />}
      </div>
    </div>
  );
};

export default TestPage;
