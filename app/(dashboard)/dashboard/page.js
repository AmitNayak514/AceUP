"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileQuestionIcon,
  TrendingUp,
  NewspaperIcon,
  BookOpen,
  Users2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
// import { useRecoilState } from "recoil";
// import { urlState } from "../atom/urlatom";
const tools = [
  {
    label: "Personalized Test",
    icon: FileQuestionIcon,
    desc: "Take adaptive tests tailored to your learning pace and needs.",
    color: "text-violet-500",
    bgColor: "text-violet-500/10",
    href: "/personalized-test",
  },
  {
    label: "Performance Insights",
    icon: NewspaperIcon,
    desc: "Get detailed insights into your test performance and areas for improvement.",
    color: "text-orange-700",
    bgColor: "text-orange-700/10",
    href: "/performance-insights",
  },
  {
    label: "Progress Tracking",
    icon: TrendingUp,
    desc: "Track your progress over time and set goals for improvement.",
    color: "text-green-700",
    bgColor: "text-green-700/10",
    href: "/progress-tracking",
  },
  {
    label: "Study Materials",
    icon: BookOpen,
    desc: "Access a library of study materials and resources to enhance your learning.",
    color: "text-blue-700",
    bgColor: "text-blue-700/10",
    href: "/study-materials",
  },
  {
    label: "Community Forums",
    icon: Users2,
    desc: "Engage with peers and experts in community forums for collaborative learning.",
    color: "text-indigo-700",
    bgColor: "text-indigo-700/10",
    href: "/community-forums",
  },
];
export default function DashBoardPage() {
  // const [url, setURL] = useRecoilState(urlState);
  const router = useRouter();
  const [initialTestGiven, setInitialTestGiven] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    const checkInitialTestGiven = async () => {
      if (user) {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.initialTest) {
            setInitialTestGiven(true);
            console.log("initial test is given");
          } else {
            setInitialTestGiven(false);
            console.log("Initial test not given");
          }
        }
      }
    };
    checkInitialTestGiven();
  });
  console.log(initialTestGiven);
  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="mb-8 space-y-4">
        <div className="text-center mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            <span className="text-[#333333]">Welcome to Your</span>
            <span className="font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              {" "}
              Adaptive Test App.{" "}
            </span>
          </h1>
        </div>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Personalized Tests, Detailed Insights, and Community Support for
          Better Learning.
        </p>
      </div>

      <div className="space-y-4 flex flex-col items-center">
        {tools.map((tool) => (
          <Card
            onClick={() => {
              router.push(`${initialTestGiven ? "/testspage" : "/gemini"}`);
            }}
            key={tool.href}
            className="p-4 border-black/5 flex items-center w-full md:w-[55rem] justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="">
                <div className="font-semibold inline">{tool.label}</div> -
                <p className="text-gray-400 font-light text-sm md:text-sm inline pl-1">
                  {tool.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* <div className="mt-4 sm:mt-6 md:mt-10 lg:mt-14 xl:mt-20 lg:m-[22%] ">
        <div className="border border-black/20 rounded-md flex flex-col md:flex-row justify-center">
          <Search className="my-auto ml-2 h-5 w-5 text-gray-400" />
          <Input
            className="outline-none focus-visible:ring-offset-0 border-0 focus-visible:ring-0 focus-visible:ring-transparent rounded-md focus-visible:outline-none focus-visible:border-0 flex-1 "
            placeholder="Enter the Youtube video URL..."
            value={url}
            onChange={(e) => {
              setURL(e.target.value);
            }}
          />
          <button
            disabled={!url.trim()}
            className={`md:ml-2 md:w-[8rem] mt-2 md:mt-0 ${
              !url.trim()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#FF0204] text-[#ebe4e4]"
            } px-4 py-2 font-bold`}
            onClick={() => router.push(`/summary`)}
          >
            Generate
          </button>
        </div>
      </div> */}
    </div>
  );
}
