import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchBooks,
  findBookByTitleAndAuthor,
} from "@/lib/books/search";

describe("searchBooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an empty array for an empty query", async () => {
    const result = await searchBooks("");

    expect(result).toEqual([]);
  });

  it("returns books when the API request succeeds", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          numFound: 1,
          docs: [
            {
              key: "/works/OL123W",
              title: "Pride and Prejudice",
              author_name: ["Jane Austen"],
              cover_i: 12345,
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const result = await searchBooks("Pride and Prejudice");

    expect(result).toEqual([
      {
        id: expect.any(Number),
        title: "Pride and Prejudice",
        authors: [{ name: "Jane Austen" }],
        formats: {
          "image/jpeg":
            "https://covers.openlibrary.org/b/id/12345-M.jpg",
        },
      },
    ]);

    expect(fetch).toHaveBeenCalledWith(
      "https://openlibrary.org/search.json?q=Pride%20and%20Prejudice&limit=12",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AI-Book-Finder/1.0",
        },
        next: {
          revalidate: 300,
        },
      }
    );
  });

  it("throws an error when the API request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response("Forbidden", {
        status: 403,
        statusText: "Forbidden",
      })
    );

    await expect(
      searchBooks("Pride and Prejudice")
    ).rejects.toThrow("Book search failed: 403");
  });

  it("finds a book by matching title and author", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          numFound: 1,
          docs: [
            {
              key: "/works/OL123W",
              title: "Pride and Prejudice",
              author_name: ["Jane Austen"],
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const result = await findBookByTitleAndAuthor(
      "Pride and Prejudice",
      "Jane Austen"
    );

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Pride and Prejudice");
    expect(result?.authors[0].name).toBe("Jane Austen");
  });

  it("returns null when no matching book is found", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          numFound: 1,
          docs: [
            {
              key: "/works/OL123W",
              title: "Pride and Prejudice",
              author_name: ["Jane Austen"],
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const result = await findBookByTitleAndAuthor(
      "The Great Gatsby",
      "F. Scott Fitzgerald"
    );

    expect(result).toBeNull();
  });
});