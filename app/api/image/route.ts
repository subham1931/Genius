// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai";

// // import { checkSubscription } from "@/lib/subscription";
// // import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

// const OPENAI_BASE_URL = "https://my-openai-gemini-wine.vercel.app/v1";

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
//     const { prompt, amount = 1, resolution = "512x512" } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!configuration.apiKey) {
//       return new NextResponse("OpenAI API Key not configured.", { status: 500 });
//     }

//     if (!prompt) {
//       return new NextResponse("Prompt is required", { status: 400 });
//     }

//     if (!amount) {
//       return new NextResponse("Amount is required", { status: 400 });
//     }

//     if (!resolution) {
//       return new NextResponse("Resolution is required", { status: 400 });
//     }

//     // const freeTrial = await checkApiLimit();
//     // const isPro = await checkSubscription();

//     // if (!freeTrial && !isPro) {
//     //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
//     // }

//     const response = await openai.createImage({
//       prompt,
//       n: parseInt(amount, 10),
//       size: resolution,
//     });

//     // if (!isPro) {
//     //   await incrementApiLimit();
//     // }

//     return NextResponse.json(response.data.data);
//   } catch (error) {
//     console.log('[IMAGE_ERROR]', error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// };


import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = "1", resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new NextResponse("Hugging Face API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const count = parseInt(amount, 10);

    // Using Stable Diffusion from Hugging Face (Free)
    const model = "stabilityai/stable-diffusion-2-1";
    const results: { url: string }[] = [];

    for (let i = 0; i < count; i++) {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("HUGGINGFACE ERROR:", error);

        // Check if model is loading
        if (response.status === 503) {
          return new NextResponse("Model is loading, please try again in a moment", { status: 503 });
        }

        return new NextResponse("Image generation failed", { status: 500 });
      }

      const imageBlob = await response.blob();
      const buffer = await imageBlob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const imageUrl = `data:image/png;base64,${base64}`;

      results.push({ url: imageUrl });
    }

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[IMAGE_API_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
