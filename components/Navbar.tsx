import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold text-[var(--foreground)]"
        >
          AI Book Finder
        </Link>

        <div className="flex items-center gap-4 text-sm sm:gap-6">
          <Link
            href="/"
            className="hover:text-[var(--primary)]"
          >
            Home
          </Link>

          <Link
            href="/search"
            className="hover:text-[var(--primary)]"
          >
            Search
          </Link>

          <Link
            href="/favorites"
            className="hover:text-[var(--primary)]"
          >
            Favorites
          </Link>
        </div>
      </nav>
    </header>
  );
}