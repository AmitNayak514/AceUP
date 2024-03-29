"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
// import { JSONLoader } from "langchain/document_loaders/fs/json";
// const loader = new JSONLoader("src/document_loaders/example_data/example.json");

const page = () => {
  const router = useRouter();
  const { user } = useUser();
  console.log(user);
  const [previousTests, setPreviousTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviousPerformance, setShowPreviousPerformance] = useState(false);
  const apiUrl = "http://localhost:3000/api/newtest";
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
  const getTest = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ previousTests }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(previousTests);
  return <button onClick={getTest}>Get Test</button>;
};

export default page;
