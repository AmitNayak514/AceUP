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
  const { previousTests, subject } = reqBody;
  const previousHistory = JSON.stringify(previousTests);
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
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
          clientEmail:
            "firebase-adminsdk-327xa@aceup-bb001.iam.gserviceaccount.com",
        }),
      },
    }),
  });
  const inputPrompt = `You are adaptive test generator, generate 15 medium difficulty mcq questions of the subject ${subject}.
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
  return NextResponse.json({ response });
}
