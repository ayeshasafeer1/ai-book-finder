import { generateObject } from "ai";
import {
  bookRecommendationSchema,
  bookFinderSystemPrompt,
  chatModel,
} from "@/lib/ai/config";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return Response.json(
        { error: "A book preference is required." },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: chatModel,
      schema: bookRecommendationSchema,
      system: bookFinderSystemPrompt,
      prompt: `
The user is looking for book recommendations.

User request:
${query.trim()}

Return 3 to 5 book recommendations that match the request.
`,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Recommendation error:", error);

    return Response.json(
      { error: "Unable to generate recommendations right now." },
      { status: 500 }
    );
  }
}