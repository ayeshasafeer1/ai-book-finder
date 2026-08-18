import Link from "next/link";

type OpenLibraryWork = {
  title?: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
};

type OpenLibraryEdition = {
  authors?: {
    name?: string;
  }[];
  covers?: number[];
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;

  let book: {
    title: string;
    authors: string[];
    description?: string;
    subjects: string[];
    cover?: string;
  } | null = null;

  try {
    const [workResponse, editionResponse] = await Promise.all([
      fetch(`https://openlibrary.org/works/${id}.json`, {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      }),
      fetch(`https://openlibrary.org/works/${id}/editions.json?limit=1`, {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      }),
    ]);

    if (workResponse.ok) {
      const work: OpenLibraryWork = await workResponse.json();

      let edition: OpenLibraryEdition | null = null;

      if (editionResponse.ok) {
        const editionData = await editionResponse.json();
        edition = editionData.entries?.[0] ?? null;
      }

      const description =
        typeof work.description === "string"
          ? work.description
          : work.description?.value;

      const coverId =
        work.covers?.[0] ?? edition?.covers?.[0];

      book = {
        title: work.title ?? "Untitled",
        authors:
          edition?.authors
            ?.map((author) => author.name)
            .filter((name): name is string => Boolean(name)) ?? [],
        description,
        subjects: work.subjects ?? [],
        cover: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : undefined,
      };
    }
  } catch (error) {
    console.error("Book details error:", error);
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
        {book.cover ? (
          <img
            src={book.cover}
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
              {book.authors.join(", ")}
            </p>
          )}
         <a
  href={`https://openlibrary.org/works/${id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 inline-block rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
>
  Read Online
</a>

          {book.description && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">
                About this book
              </h2>

              <p className="mt-3 leading-7 text-[var(--muted)]">
                {book.description}
              </p>
            </section>
          )}

          {book.subjects.length > 0 && (
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