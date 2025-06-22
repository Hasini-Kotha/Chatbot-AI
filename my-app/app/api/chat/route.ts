import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("📩 Received messages:", messages);

  const userMessageObj = messages[messages.length - 1];

  // ✅ Fix: safely extract text even if it's structured (content: [{ type, text }])
  let userMessage = "";

  if (typeof userMessageObj.content === "string") {
    userMessage = userMessageObj.content;
  } else if (Array.isArray(userMessageObj.content)) {
    userMessage = userMessageObj.content.map((c: any) => c.text).join(" ");
  }

  console.log("✅ Parsed user message:", userMessage);

  if (!userMessage.trim()) {
    console.error("❌ Invalid user message");
    return new Response("Invalid user message", { status: 400 });
  }

  // Save user message
  await addDoc(collection(db, "messages"), {
    role: "user",
    text: userMessage,
    timestamp: serverTimestamp(),
  });

  // Gemini stream
  const result = await streamText({
    model: google("gemini-2.0-flash"),
    messages,
  });

  let fullReply = "";

  for await (const delta of result.fullStream as any) {
    if (delta.type === "text-delta" && delta.delta?.text) {
      fullReply += delta.delta.text;
    }
  }

  console.log("🤖 Gemini reply:", fullReply);

  if (fullReply.trim()) {
    await addDoc(collection(db, "messages"), {
      role: "ai",
      text: fullReply,
      timestamp: serverTimestamp(),
    });
  }

  return result.toDataStreamResponse();
}
