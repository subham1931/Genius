// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai";

// // import { checkSubscription } from "@/lib/subscription";
// // import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

// // const OPENAI_BASE_URL = "https://my-openai-gemini-wine.vercel.app/v1";
// const OPENAI_BASE_URL = "https://api.openai.com/v1/chat/completions";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
//   basePath: OPENAI_BASE_URL, 
// });

// const openai = new OpenAIApi(configuration);

// export async function POST(
//   req: Request
// ) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages  } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!configuration.apiKey) {
//       return new NextResponse("OpenAI API Key not configured.", { status: 500 });
//     }

//     if (!messages) {
//       return new NextResponse("Messages are required", { status: 400 });
//     }

//     // const freeTrial = await checkApiLimit();
//     // const isPro = await checkSubscription();

//     // if (!freeTrial && !isPro) {
//     //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
//     // }

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages
//     });

//     // if (!isPro) {
//     //   await incrementApiLimit();
//     // }

//     return NextResponse.json(response.data.choices[0].message);
//   } catch (error) {
//     console.log('[CONVERSATION_ERROR]', error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// };


//openai
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { OpenAI } from "openai";


// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!messages) {
//       return new NextResponse("Messages are required", { status: 400 });
//     }

//     const completion = await client.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages,
//     });

//     return NextResponse.json(completion.choices[0].message);
//   } catch (error) {
//     console.log("[CONVERSATION_ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }


import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return new NextResponse("Google API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // Use Gemini 2.5 Flash (latest stable, fast and free)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const lastMessage = messages[messages.length - 1];
    // console.log("Sending message to Gemini:", lastMessage.content);
    const result = await chat.sendMessage(lastMessage.content);
    // console.log("Gemini response received");
    const response = await result.response;
    const content = response.text();

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({
      role: "assistant",
      content,
    });

  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
