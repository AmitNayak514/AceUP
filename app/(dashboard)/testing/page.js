import { BufferMemory } from "langchain/memory";
import { FirestoreChatMessageHistory } from "@langchain/community/stores/message/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import admin from "firebase-admin";
import { getAuth } from "@clerk/nextjs/server";
const page = async () => {
  //   const { sessionId } = getAuth();
  const memory = new BufferMemory({
    chatHistory: new FirestoreChatMessageHistory({
      collections: ["users"],
      docs: ["user_2e4cwTZqYAGmVzKfFmbKmma5fXL"],
      sessionId: "sessionId",
      userId: "user_2e4cwTZqYAGmVzKfFmbKmma5fXL",
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
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY, // Ensure you have this set
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
  });
  const chain = new ConversationChain({ llm: model, memory });
  const res1 = await chain.call({ input: "Hi! I'm Jim." });
  console.log(`Res1: ${res1}`);
  const res2 = await chain.call({ input: "What is this data all about?" });
  console.log(`Res2: ${res2}`);
  return <div>hi</div>;
};

export default page;
