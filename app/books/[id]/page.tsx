import Link from "next/link";
type Author = {
  name: string;
};

type Book = {
  id: number;
  title: string;
  authors: Author[];
  summaries?: string[];
  subjects?: string[];
  formats?: {
    ["image/jpeg"]?: string;
    ["text/html"]?: string;
  };
  };


type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;

  let book: Book | null = null;

  try {
    const response = await fetch(`https://gutendex.com/books/${id}`);

    if (response.ok) {
      book = await response.json();
    }
  } catch {
    book = null;
  }

  if (!book) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-bold">Book not found</h1>

        <p className="mt-3 text-[var(--muted)]">
          We couldn't load this book right now.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <Link
  href="/search"
  className="mb-8 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
>
  ← Back to search
</Link>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {book.formats?.["image/jpeg"] ? (
          <img
            src={book.formats["image/jpeg"]}
            alt={`Cover of ${book.title}`}
            className="w-full rounded-xl object-cover"
          />
        ) : (
          <div
            className="flex min-h-80 items-center justify-center rounded-xl bg-gray-100 px-4 text-center"
            aria-label="No cover available"
          >
            <span className="text-sm text-[var(--muted)]">
              No cover available
            </span>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            {book.title}
          </h1>

          {book.authors.length > 0 && (
            <p className="mt-3 text-lg text-[var(--muted)]">
              {book.authors.map((author) => author.name).join(", ")}
            </p>
          )}
          {book.formats?.["text/html"] && (
  <a
    href={book.formats["text/html"]}
    target="_blank"
    rel="noopener noreferrer"
className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-medium text-[var(--foreground)] border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2 transition-all"
  >
    Read Online
  </a>
)}

          {book.summaries?.[0] && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">About this book</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {book.summaries[0]}
              </p>
            </section>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Subjects</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {book.subjects.slice(0, 10).map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}