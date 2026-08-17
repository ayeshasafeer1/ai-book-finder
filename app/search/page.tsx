"use client";

import AIRecommendations from "@/components/ai/AIRecommendations";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Author = {
  name: string;
};

type Book = {
  id: number;
  title: string;
  authors: Author[];
  formats?: {
    ["image/jpeg"]?: string;
  };
};

type SearchResponse = {
  results: Book[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a book title or author.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );

      const data: SearchResponse & { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed.");
      }

      setBooks(data.results);
    } catch {
      setBooks([]);
      setError(
        "We couldn't search for books right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Book Finder</h1>

      <p className="mt-3 text-[var(--muted)]">
        Search for books and discover your next read.
      </p>
      <AIRecommendations />
      <form
        onSubmit={handleSearch}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="book-search" className="sr-only">
          Search for a book
        </label>

        <input
  id="book-search"
  type="search"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Search by title or author..."
  autoComplete="off"
  className="min-h-11 flex-1 rounded-lg border border-gray-300 px-4"
/>

<button
  type="submit"
  disabled={loading}
          className="min-h-11 rounded-lg bg-black px-6 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-6 text-red-600">
          {error}
        </p>
      )}
      {loading && (
  <div
    className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    role="status"
    aria-live="polite"
    aria-label="Searching for books"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-xl border border-gray-200"
      >
        <div className="h-64 bg-gray-200" />

        <div className="space-y-3 p-5">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
)}

{!loading && !error && books.length === 0 && (
  <p className="mt-10 text-[var(--muted)]">
    {query
      ? `No books found for "${query}". Try another title or author.`
      : "Search for a title or author to get started."}
  </p>
)}

{books.length > 0 && (
  <section
    aria-label="Search results"
    aria-live="polite"
    className="mt-10"
  >
          <h2 className="text-2xl font-semibold">Results</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
             <Link
             key={book.id}
             href={`/books/${book.id}`}
             className="group overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black"
           >
             {book.formats?.["image/jpeg"] ? (
               <img
                 src={book.formats["image/jpeg"]}
                 alt={`Cover of ${book.title}`}
                 className="h-64 w-full object-cover"
               />
             ) : (
               <div
                 className="flex h-64 items-center justify-center bg-gray-100 px-4 text-center"
                 aria-label="No cover available"
               >
                 <span className="text-sm text-[var(--muted)]">
                   No cover available
                 </span>
               </div>
             )}
           
             <div className="p-5">
               <h3 className="text-lg font-semibold group-hover:underline">
                 {book.title}
               </h3>
           
               {book.authors.length > 0 && (
                 <p className="mt-2 text-sm text-[var(--muted)]">
                   {book.authors.map((author) => author.name).join(", ")}
                 </p>
               )}
             </div>
           </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}