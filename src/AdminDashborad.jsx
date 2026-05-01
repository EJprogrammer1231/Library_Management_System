import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";
import {
  addBook,
  getBookCounts,
  getStoredBooks,
  removeBook,
} from "./libraryBooks";

function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(() => getStoredBooks());
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    image: "",
  });
  const [imageInputKey, setImageInputKey] = useState(0);
  const [message, setMessage] = useState("");

  const activity = [
    "under developing",
    "under developing",
    "under developing",
  ];

  const bookCounts = getBookCounts(books);

  const stats = [
    { label: "Total Books", value: bookCounts.total.toString() },
    { label: "Borrowed", value: bookCounts.borrowed.toString() },
    { label: "Reserved", value: bookCounts.reserved.toString() },
    { label: "Available", value: bookCounts.available.toString() },
  ];

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

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const syncBooks = () => setBooks(getStoredBooks());

    syncBooks();
    window.addEventListener("storage", syncBooks);
    window.addEventListener("scas-library-books-updated", syncBooks);

    return () => {
      window.removeEventListener("storage", syncBooks);
      window.removeEventListener("scas-library-books-updated", syncBooks);
    };
  }, []);

  const handleBookFormChange = (event) => {
    const { name, value } = event.target;
    setBookForm((current) => ({ ...current, [name]: value }));
  };

  const handleBookImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setBookForm((current) => ({ ...current, image: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBookForm((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddBook = (event) => {
    event.preventDefault();

    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      setMessage("Please enter both a book title and author.");
      return;
    }

    addBook({
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      image: bookForm.image,
    });

    setBookForm({ title: "", author: "", image: "" });
    setImageInputKey((current) => current + 1);
    setBooks(getStoredBooks());
    setMessage("New book added successfully.");
  };

  const handleDeleteBook = (book) => {
    const confirmed = window.confirm(
      `Delete "${book.title}" by ${book.author}?`,
    );

    if (!confirmed) {
      return;
    }

    removeBook(book.id);
    setBooks(getStoredBooks());
    setMessage(`"${book.title}" was deleted.`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-gray-200 p-4">
          <img src={logo} alt="SCAS logo" className="h-12 w-12" />
          <div>
            <p className="text-sm font-bold">SUMULONG COLLEGE</p>
            <p className="text-xs text-gray-500">OF ARTS AND SCIENCE</p>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          <MenuItem label="Dashboard" active />
          <MenuItem label="Books" />
          <MenuItem label="Requests" />
          <MenuItem label="Students" />
          <MenuItem label="Announcements" />
          <MenuItem label="Reports" />
          <MenuItem label="Settings" />
        </nav>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-4 py-3 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
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

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
                  Admin Dashboard
                </p>
                <h1 className="text-xl font-bold text-gray-900">
                  Library management overview
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <form className="w-full md:w-96" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search books or requests..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-500"
                />
              </form>

              <div className="hidden items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white">
                  A
                </div>
                <div className="text-sm">
                  <span className="block font-medium text-gray-800">
                    Administrator
                  </span>
                  <span className="block text-xs text-gray-500">Full access</span>
                </div>
              </div>
            </div>
          </div>
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
              </article>
            ))}
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent Books
                  </h2>
                  <p className="text-sm text-gray-500">
                    Latest catalog entries and statuses
                  </p>
                  {searchTerm.trim() && (
                    <p className="mt-1 text-sm text-gray-500">
                      Showing {filteredBooks.length} result
                      {filteredBooks.length === 1 ? "" : "s"} for{" "}
                      <span className="font-semibold text-gray-900">
                        {searchTerm.trim()}
                      </span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  View all
                </button>
              </div>

              <form
                className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                onSubmit={handleAddBook}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleBookFormChange}
                    placeholder="Book title"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleBookFormChange}
                    placeholder="Author"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <input
                    key={imageInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleBookImageChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Add Book
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <img
                    src={bookForm.image || logo}
                    alt="Book cover preview"
                    className="h-16 w-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Cover preview
                    </p>
                    <p className="text-xs text-gray-500">
                      Upload an image to use it as the book cover.
                    </p>
                  </div>
                </div>
              </form>

              {message && (
                <p className="mt-3 text-sm text-gray-600">{message}</p>
              )}

              <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                  <article
                    key={book.title}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-52 w-full object-cover"
                    />
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
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
                        className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                      >
                        Manage
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book)}
                        className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 sm:col-span-2">
                    No books found.
                  </div>
                )}
              </section>
            </article>

            <aside className="space-y-4">
              <article className="rounded-lg border border-gray-300 bg-white p-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Today&apos;s Activity
                </h2>
                <div className="mt-4 space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-lg border border-gray-300 bg-white p-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Quick Action
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Review pending requests or add a new book record.
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Open Requests
                </button>
              </article>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

function MenuItem({ label, active }) {
  return (
    <div
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-gray-200 font-semibold text-gray-900"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </div>
  );
}

export default AdminDashboard;
