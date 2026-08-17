import { searchBooks } from "@/lib/books/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return Response.json(
      { error: "Search query is required." },
      { status: 400 }
    );
  }

  try {
    const books = await searchBooks(query);

    return Response.json({
      count: books.length,
      results: books,
    });
  } catch (error) {
    console.error("Book search error:", error);

    return Response.json(
      {
        error: "Unable to search for books right now.",
      },
      { status: 502 }
    );
  }
}