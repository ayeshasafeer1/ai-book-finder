export type BookAuthor = {
    name: string;
  };
  
  export type Book = {
    id: string;
    title: string;
    authors: BookAuthor[];
    summaries?: string[];
    subjects?: string[];
    formats?: {
      "image/jpeg"?: string;
      "text/html"?: string;
    };
  };
  
  type OpenLibraryDoc = {
    key?: string;
    title?: string;
    author_name?: string[];
    cover_i?: number;
  };
  
  type OpenLibraryResponse = {
    numFound: number;
    docs: OpenLibraryDoc[];
  };
  
  export async function searchBooks(query: string): Promise<Book[]> {
    const trimmedQuery = query.trim();
  
    if (!trimmedQuery) {
      return [];
    }
  
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        trimmedQuery
      )}&limit=12`,
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
  
    if (!response.ok) {
      const errorText = await response.text();
  
      throw new Error(
        `Book search failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
  
    const data: OpenLibraryResponse = await response.json();
  
    return data.docs
      .filter((book) => book.key && book.title)
      .map((book) => ({
        id: book.key!.replace("/works/", ""),
        title: book.title!,
        authors: (book.author_name ?? []).map((name) => ({
          name,
        })),
        formats: book.cover_i
          ? {
              "image/jpeg": `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
            }
          : {},
      }));
  }
  
  export async function findBookByTitleAndAuthor(
    title: string,
    author: string
  ): Promise<Book | null> {
    const results = await searchBooks(title);
  
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
  
    const normalizedTitle = normalize(title);
    const normalizedAuthor = normalize(author);
  
    const exactMatch = results.find((book) => {
      const titleMatches = normalize(book.title) === normalizedTitle;
  
      const authorMatches = book.authors.some((bookAuthor) => {
        const bookAuthorName = normalize(bookAuthor.name);
  
        const authorParts = normalizedAuthor.split(" ");
        const bookAuthorParts = bookAuthorName.split(" ");
  
        return authorParts.every((part) =>
          bookAuthorParts.includes(part)
        );
      });
  
      return titleMatches && authorMatches;
    });
  
    return exactMatch ?? null;
  }