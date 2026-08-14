import { convertToModelMessages, streamText } from "ai";
import {
  chatModel,
  bookFinderSystemPrompt,
} from "@/lib/ai/config";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: chatModel,
    system: bookFinderSystemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}