import Chat from "@/components/chat/Chat";
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Book Finder
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
          Discover your next favorite book with intelligent recommendations.
        </p>

        <div className="mt-8">
          <a
            href="/search"
            className="inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white hover:bg-[var(--primary-hover)]"
          >
            Find a Book
          </a>
        </div>
      </section>
      <Chat />
    </main>
  );
}