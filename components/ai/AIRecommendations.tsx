"use client";

import Link from "next/link";
import { useState } from "react";

type Book = {
  id: number;
  title: string;
  authors: {
    name: string;
  }[];
  formats?: {
    "image/jpeg"?: string;
  };
};

type Recommendation = {
  title: string;
  author: string;
  reason: string;
};

type Result = {
  recommendation: Recommendation;
  book: Book | null;
};

export default function AIRecommendations() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/recommend/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Recommendation failed.");
      }

      setResults(data.recommendations);
    } catch {
      setError(
        "We couldn't generate recommendations right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="ai-discovery-heading"
      className="mt-10 rounded-2xl border border-gray-200 p-5 sm:p-6"
    >
      <h2
        id="ai-discovery-heading"
        className="text-2xl font-bold"
      >
        Discover with AI
      </h2>

      <p className="mt-2 text-[var(--muted)]">
        Tell us what you're in the mood to read.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="ai-book-query" className="sr-only">
          Describe what you want to read
        </label>

        <input
          id="ai-book-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. a gothic romance with mystery"
          className="min-h-11 flex-1 rounded-lg border border-gray-300 px-4"
        />

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="min-h-11 rounded-lg bg-[var(--foreground)] px-6 font-medium text-[var(--background)] disabled:opacity-50"
        >
          {loading ? "Finding books..." : "Find with AI"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-5 text-red-600"
        >
          {error}
        </p>
      )}

      {loading && (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 text-[var(--muted)]"
        >
          Finding recommendations...
        </p>
      )}

      {results.length > 0 && (
        <>
          <h3 className="mt-8 text-xl font-semibold">
            AI recommendations
          </h3>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {results.map((result, index) => (
              <article
                key={`${result.recommendation.title}-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
               {result.book ? (
  result.book.formats?.["image/jpeg"] ? (
    <img
      src={result.book.formats["image/jpeg"]}
      alt={`Cover of ${result.book.title}`}
      className="h-64 w-full object-cover"
    />
  ) : (
    <div
      className="flex h-64 items-center justify-center bg-gray-100 px-4 text-center"
      aria-label={`No cover available for ${result.book.title}`}
    >
      <span className="text-sm text-[var(--muted)]">
        No cover available
      </span>
    </div>
  )
) : (
  <div
    className="flex h-32 items-center justify-center bg-gray-50 px-4 text-center"
    aria-hidden="true"
  >
    <span className="text-sm text-[var(--muted)]">
      Catalog match unavailable
    </span>
  </div>
)}

                <div className="p-5">
                  <h4 className="text-lg font-semibold">
                    {result.recommendation.title}
                  </h4>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {result.recommendation.author}
                  </p>

                  <p className="mt-4 text-sm leading-6">
                    {result.recommendation.reason}
                  </p>

                  {result.book ? (
                   <Link
                   href={`/books/${result.book.id}`}
                   aria-label={`View details for ${result.book.title}`}
                      className="mt-5 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                    >
                      View book
                    </Link>
                  ) : (
                    <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2 text-sm text-[var(--muted)]">
                      This recommendation isn't available in our public-domain catalog.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}