import { BufferMemory } from "langchain/memory";
import { FirestoreChatMessageHistory } from "@langchain/community/stores/message/firestore";
import {
  ConversationChain,
  ConversationalRetrievalQAChain,
} from "langchain/chains";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import admin from "firebase-admin";
import { getAuth } from "@clerk/nextjs/server";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
export async function POST(req) {
  const { userId } = getAuth(req);
  const { sessionId } = getAuth(req);
  const reqBody = await req.json();
  const { previousTests } = reqBody;
  const previousHistory = JSON.stringify(previousTests);
  // console.log(previousHistory);
  if (!userId) {
    return NextResponse.status(401).json({ error: "Not authenticated" });
  }
  // console.log(previousTests[0]);
  // const jsonObject = {
  //   texts: ["This is a sentence.", "This is another sentence."],
  // };
  // const loader = new JSONLoader(previousTests[0]);
  // const loader = new JSONLoader(jsonObject);
  // const data = await loader.load();
  // console.log(data);
  // const text_splitter = new CharacterTextSplitter({
  //   chunkSize: 1000,
  //   chunkOverlap: 0,
  // });
  // const texts = text_splitter.splitDocuments(data);
  // const embeddings = new GoogleGenerativeAIEmbeddings({
  //   modelName: "embedding-001",
  //   apiKey: process.env.GOOGLE_API_KEY,
  // });
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
  });
  const memory = new BufferMemory({
    chatHistory: new FirestoreChatMessageHistory({
      collections: ["users"],
      docs: [userId],
      sessionId: sessionId,
      userId: userId,
      config: {
        projectId: "aceup-bb001",
        credential: admin.credential.cert({
          projectId: "aceup-bb001",
          privateKey:
            "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC36e3kLQXsSpoh\nRwTNj4IV/vNigYZBbuXQIaC2YQbHgx6Hl1u5FiZraDNKYVlXQUYY7OSj/IliP2bt\n8BcKsNcvcp2wcGHrRd8KPxpes0L1pRsthbMTXb7OL5rlYz98E6sqGr4VmNU0KoX8\nbHEIUjrpLni7e3OdItFcF84vhzFe4fZbyGXLOt051CL1Oka8HABLR1ia+dAPl1SS\nWwKkAZ0VUmTnmaXZ0J6zu14GOahkGG/BRfjL3SsNo/foaL4Itf8poRfM2jBRPMpW\ns1XlGItxya7BLKzQU2SSXagwCECEDUx0Ctx7HWdBQxRnqzicbn31yk65k24W0rGA\nquU+iPlXAgMBAAECggEAEzaKhihX8o/2mxxeuZTQ67hXN8a9Pk+2DXC959+qBCTE\nBzk+OU9Bkz3vAcm6uh1VE9yHpEQJHCzwdVH8Lj88M7Y/GAQdjqUdgGYIPLVwfNYT\nSUWq6A6GlOavQWCFbNJnMr5ZdkshltIMbkrr4gkpI1wZ+8gRU2ykP4EzJo7yju1R\n5245537rYv7w8tR4vNynm3kJ13JGLfpUg8ihTEhiltH6vxlWzeIPSabC+8AH1YKT\nfUAa6FNuQdktOlarCIEy4yddPYZ6ST2ZFEuYjUY9oqFY4QbvuAtCzI1EA/J9fpp4\njf2qTYUQmO9YntIP3E+aXKjOpHQi01UI9Lh8I0iUNQKBgQDak/i4roiTis59ddPu\ngwsx68SGMtRrqHCcqCQ9AQOSpNB9bvW3tV9Ai0AvJFNlv2kQTCq6X8dMeLz/uyVI\nngu5Aa7Jzkt4TssxPTDW9f3I3/l2vRbWSUBLhBV5EhcmlHZa1sddTgiI5Iwa6HvM\nKNNqwDhyK9bTmo1NQKYdmPvSuwKBgQDXZqnhNWsxSfpzKKLXYOQ31KcZNTu/XeC4\n2G3PHmCEB03j6ogApIz+X0uKnyfEUKa8SbqZlb7Wg2yadGxVDEfYZjGX8J79t7Pm\nURqqbM2plAnumksXwfK0QXMbWQBSX+oiOXoAnjuVPkyJulAYz9U7GJXLh+StM3Ti\n9blnd08QFQKBgQDYEeiQIDBwsYmYKi8bmz0o1ykJhBvKZNMVeX2BNIxknTpglJyg\nQtHrSvxi3aT3cvUYIEMow9+O79fdcRHVLC7obwprAdxHDJT+kr/B76A1v3qqbxex\nMu40+FgFu+VYxPAOsjyYNrhnIo6BVwpx8nW0FFp4Om/988z07hCIN5/QWwKBgQC3\nx5Qx3k3y49eX4Zfug3C0Ye+gBldP010k2SP3j0dx3nmKeFRJmBvj/JKLV3eqe9WG\n2LEo0SbeB4vlzGeRuMSj0a2GoXpFpzMK0zAZMHPYt8IxndtsDcJyIVWAg9NOdR9i\ny/9X/6l+kITlDd3BDbI0lalY2j01ua2E53qk2JrQcQKBgQCTUvNsUphPlMdM8cSN\nCTm4+iA2kmMIx48fcCnVRMPgQyl7FWUKaK+ly80RrsppfSLfw7C4bZB3aMaKapYY\nfqCkpVHAcz0jIk6UNsYrykw2hZnusnS7OO90iOb6sauiOfeNHOA4WHun8ayydq+0\n4r3FFCbl7TFJ3SM4/olTJIOnkA==\n-----END PRIVATE KEY-----\n",
          clientEmail:
            "firebase-adminsdk-327xa@aceup-bb001.iam.gserviceaccount.com",
        }),
      },
    }),
  });
  const inputPrompt = `You are adaptive test generator, generate 15 medium difficulty mcq questions of the subject DSA.
  Also provide the answer separately.Also you are aim to better the performance of the student , so on the basis of the previous provided performance of the student which is ${previousHistory}, generate question by varying the difficulty with a criteria that if the student score less then 50% in a test, the difficulty of the test should decrease and if scores more, then increase. Also avoid repition of questions that are already marked correct by student and learn from previous chat history. Return an array of objects don't use markdown.The options of one question should not match strictly with any other options and there should only be four options
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
  const chain = new ConversationChain({
    llm: model,
    memory,
  });
  const response = await chain.call({ input: inputPrompt });
  console.log({ response });
  return NextResponse.json({ response });
}
