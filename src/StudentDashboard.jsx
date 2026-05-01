import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";
import { getBookCounts, getStoredBooks, updateBookStatus } from "./libraryBooks";
import { getStoredProfile } from "./userProfile";

function Layout() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [books, setBooks] = useState(() => getStoredBooks());
  const [selectedBook, setSelectedBook] = useState(null);
  const [profile, setProfile] = useState(() => getStoredProfile());

  useEffect(() => {
    const syncBooks = () => setBooks(getStoredBooks());
    const syncProfile = () => setProfile(getStoredProfile());

    syncBooks();
    syncProfile();
    window.addEventListener("storage", syncBooks);
    window.addEventListener("storage", syncProfile);
    window.addEventListener("scas-library-books-updated", syncBooks);
    window.addEventListener("scas-user-profile-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncBooks);
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("scas-library-books-updated", syncBooks);
      window.removeEventListener("scas-user-profile-updated", syncProfile);
    };
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  const borrowedBooks = books.filter((book) => book.status === "Borrowed");
  const bookCounts = getBookCounts(books);

  const stats = [
    {
      label: "Total Books",
      value: bookCounts.total.toString(),
      note: "All books in the library",
    },
    {
      label: "Borrowed",
      value: bookCounts.borrowed.toString(),
      note: "Currently checked out",
    },
    {
      label: "Reserved",
      value: bookCounts.reserved.toString(),
      note: "Waiting for pickup",
    },
    {
      label: "Available",
      value: bookCounts.available.toString(),
      note: "Ready to borrow",
    },
  ];

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveSection("books");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setActiveSection("books");
    }
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  const handleBorrowBook = (book) => {
    updateBookStatus(book.id, "Borrowed");
    setSelectedBook(null);
  };

  const handleReserveBook = (book) => {
    updateBookStatus(book.id, "Reserved");
    setSelectedBook(null);
  };

  const handleOpenBooks = () => {
    setActiveSection("books");
    setOpen(false);
  };

  const handleOpenDashboard = () => {
    setActiveSection("dashboard");
    setOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900">
      <aside
        className={`
        fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white
        transform transition-transform duration-300 md:static
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center gap-3 p-4">
          <img src={logo} className="h-12 w-12" alt="logo" />
          <div className="leading-tight">
            <span className="block text-sm font-bold">SUMULONG COLLEGE</span>
            <span className="block text-xs font-medium text-gray-500">
              OF ARTS AND SCIENCE
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <MenuItem
            label="Dashboard"
            active={activeSection === "dashboard"}
            onClick={handleOpenDashboard}
          />
          <MenuItem
            label="All Books"
            active={activeSection === "books"}
            onClick={handleOpenBooks}
          />
          <MenuItem label="Course Materials" />
          <MenuItem label="Announcements" />
          <MenuItem label="Profile" />
          <MenuItem label="Settings" />
          <MenuItem label="Logout" />
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex flex-col gap-3 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white"
              onClick={() => setOpen(true)}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-gray-800" />
                <span className="block h-0.5 w-5 rounded-full bg-gray-800" />
                <span className="block h-0.5 w-5 rounded-full bg-gray-800" />
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
                Student Dashboard
              </p>
              <h1 className="truncate text-lg font-semibold text-gray-800 md:text-xl">
                Hi, Students
              </h1>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-400 text-white">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">S</span>
                )}
              </div>
              <div className="text-sm">
                <span className="block font-medium text-gray-800">
                  {profile?.fullName || "Student"}
                </span>
                <span className="block text-xs text-gray-500">BSIT-2</span>
              </div>
            </div>
          </div>

          <form
            className="flex w-full max-w-sm items-stretch gap-2"
            onSubmit={handleSearch}
          >
            <input
              id="input-search"
              type="text"
              placeholder="Find materials..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
            />
            <button
              id="button-search"
              type="submit"
              className="shrink-0 rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-500 cursor-pointer"
            >
              Search
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-xl border border-gray-300 bg-white p-4"
              >
                <span className="block text-sm font-medium text-gray-500">
                  {stat.label}
                </span>
                <span className="mt-2 block text-3xl font-semibold text-gray-900">
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {stat.note}
                </span>
              </article>
            ))}
          </section>

          {activeSection === "dashboard" ? (
            <>
              {searchTerm.trim() && (
                <section className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
                  Showing {filteredBooks.length} result
                  {filteredBooks.length === 1 ? "" : "s"} for{" "}
                  <span className="font-semibold text-gray-900">
                    {searchTerm.trim()}
                  </span>
                </section>
              )}

              <section className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-gray-300 bg-white p-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleOpenBooks}
                  className="cursor-pointer rounded bg-gray-200 p-2 text-sm text-gray-800 hover:bg-gray-300 sm:w-auto w-full"
                >
                  View all Books
                </button>
                <span className="cursor-pointer rounded text-xs text-gray-500 sm:w-auto w-full">
                  - Weekly added -
                </span>
              </section>

              <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.slice(0, 4).map((book) => (
                  <article
                    key={book.id}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl hover:ring-gray-300"
                  >
                    <div className="aspect-3/4 w-full overflow-hidden bg-gray-100">
                      <img
                        src={book.image || logo}
                        alt={book.title}
                        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="space-y-2 p-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDetails(book)}
                        className="w-full cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <section className="mt-12">
                <article className="rounded-lg border border-gray-300 bg-white p-4 shadow-none">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                      <h2 className="text-base font-semibold text-gray-900">
                        My Borrowed
                      </h2>
                    </div>

                    <button
                      type="button"
                      className="mx-auto inline-flex w-28 items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 sm:mx-0 sm:w-auto"
                    >
                      View all
                    </button>
                  </div>

                  <section className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {borrowedBooks.length > 0 ? (
                      borrowedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0"
                        >
                          <img
                            src={book.image || logo}
                            alt={book.title}
                            className="h-14 w-10 flex-none rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-gray-900">
                              {book.title}
                            </h3>
                            <p className="truncate text-xs text-gray-500">
                              by {book.author}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                              Borrowed
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No borrowed books yet.
                      </div>
                    )}
                  </section>
                </article>
              </section>
            </>
          ) : (
            <section className="mt-4 rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    All Books
                  </h2>
                  <p className="text-sm text-gray-500">
                    Browse every book added by the admin and choose borrow or reserve.
                  </p>
                  {searchTerm.trim() && (
                    <p className="mt-1 text-sm text-gray-500">
                      Search results for{" "}
                      <span className="font-semibold text-gray-900">
                        {searchTerm.trim()}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleOpenDashboard}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Back to dashboard
                </button>
              </div>

              <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <article
                      key={book.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <div className="aspect-3/4 w-full overflow-hidden bg-gray-100">
                        <img
                          src={book.image || logo}
                          alt={book.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {book.title}
                            </h3>
                            <p className="text-xs text-gray-500">{book.author}</p>
                          </div>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${
                              book.status === "Borrowed"
                                ? "bg-amber-100 text-amber-700"
                                : book.status === "Reserved"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewDetails(book)}
                          className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBorrowBook(book)}
                          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                          Borrow
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReserveBook(book)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                        >
                          Reserve
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 sm:col-span-2 lg:col-span-4">
                    No books found.
                  </div>
                )}
              </section>
            </section>
          )}
        </main>
      </div>

      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelectedBook(null)}
        >
          <article
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-200 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                  Book Details
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {selectedBook.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr]">
              <img
                src={selectedBook.image || logo}
                alt={selectedBook.title}
                className="h-56 w-full rounded-xl object-cover"
              />

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Author</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedBook.author}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedBook.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm leading-6 text-gray-700">
                    {selectedBook.description ||
                      "No description available for this book yet."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleBorrowBook(selectedBook)}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Borrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReserveBook(selectedBook)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-gray-200 font-semibold text-gray-900"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

export default Layout;
