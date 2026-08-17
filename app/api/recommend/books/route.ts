import { findBookByTitleAndAuthor } from "@/lib/books/search";
import { bookRecommendationSchema, chatModel, bookFinderSystemPrompt } from "@/lib/ai/config";
import { generateObject } from "ai";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return Response.json(
        { error: "A book preference is required." },
        { status: 400 }
      );
    }

    const recommendationResult = await generateObject({
      model: chatModel,
      schema: bookRecommendationSchema,
      system: bookFinderSystemPrompt,
      prompt: `
The user is looking for book recommendations.

User request:
${query.trim()}

Return 3 to 5 book recommendations.
`,
    });

    const recommendations = recommendationResult.object.recommendations;

    const books = await Promise.all(
      recommendations.map(async (recommendation) => {
        const book = await findBookByTitleAndAuthor(
          recommendation.title,
          recommendation.author
        );

        return {
          recommendation,
          book,
        };
      })
    );

    const availableBooks = books.filter((item) => item.book !== null);

    return Response.json({
      recommendations: books,
      availableBooks,
    });
  } catch (error) {
    console.error("AI book discovery error:", error);

    return Response.json(
      { error: "Unable to find recommended books right now." },
      { status: 500 }
    );
  }
}