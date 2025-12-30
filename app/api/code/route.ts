import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const instructionMessage = "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.";

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

    // Use Gemini 1.5 Pro for better code generation capabilities
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: instructionMessage,
    });

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const content = response.text();

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({
      role: "assistant",
      content,
    });

  } catch (error: any) {
    console.error("[CODE_ERROR]", error);
    // Provide more specific error details if available
    const errorMessage = error?.message || "Internal Error";
    return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 });
  }
}

