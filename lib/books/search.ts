export type BookAuthor = {
    name: string;
  };
  
  export type Book = {
    id: number;
    title: string;
    authors: BookAuthor[];
    summaries?: string[];
    subjects?: string[];
    formats?: {
      "image/jpeg"?: string;
      "text/html"?: string;
    };
  };
  
  type GutendexResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Book[];
  };
  
  export async function searchBooks(query: string): Promise<Book[]> {
    const trimmedQuery = query.trim();
  
    if (!trimmedQuery) {
      return [];
    }
  
    const response = await fetch(
        `https://gutendex.com/books/?search=${encodeURIComponent(trimmedQuery)}`,
        {
          headers: {
            "User-Agent": "AI-Book-Finder/1.0",
            Accept: "application/json",
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
  
    const data: GutendexResponse = await response.json();
  
    return data.results;
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
  