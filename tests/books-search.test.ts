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
    const fetchMock = vi.spyOn(global, "fetch");

    const result = await searchBooks("   ");

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns books when the API request succeeds", async () => {
    const mockBooks = [
      {
        id: 1342,
        title: "Pride and Prejudice",
        authors: [{ name: "Austen, Jane" }],
      },
    ];

    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: mockBooks,
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

    expect(result).toEqual(mockBooks);

    expect(fetch).toHaveBeenCalledWith(
      "https://gutendex.com/books/?search=Pride%20and%20Prejudice",
      {
        next: {
          revalidate: 300,
        },
      }
    );
  });

  it("throws an error when the API request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(null, {
        status: 500,
      })
    );

    await expect(
      searchBooks("Pride and Prejudice")
    ).rejects.toThrow("Book search failed");
  });
});
it("finds a book by matching title and author", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1342,
              title: "Pride and Prejudice",
              authors: [{ name: "Austen, Jane" }],
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
  
    expect(result?.id).toBe(1342);
    expect(result?.title).toBe("Pride and Prejudice");
  });
  
  it("returns null when no matching book is found", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1342,
              title: "Pride and Prejudice",
              authors: [{ name: "Austen, Jane" }],
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