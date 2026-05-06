import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";
import books1 from "./assets/books1.png";
import {
  addBook,
  getBookCounts,
  getStoredBooks,
  removeBook,
  updateBook,
} from "./libraryBooks";
import { getStoredProfile } from "./userProfile";

function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(() => getStoredBooks());
  const theme = "light";

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    image: "",
  });

  const [imageInputKey, setImageInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [, setProfile] = useState(() => getStoredProfile());
  const [manageBooksOpen, setManageBooksOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [descriptionBook, setDescriptionBook] = useState(null);
  const [manageBookForm, setManageBookForm] = useState({
    title: "",
    author: "",
    image: "",
    status: "Available",
  });
  const [manageImageInputKey, setManageImageInputKey] = useState(0);

  const activity = [
    "under devloping",
    "under devloping",
    "under devloping",
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

  const handleManageBookFormChange = (event) => {
    const { name, value } = event.target;
    setManageBookForm((current) => ({ ...current, [name]: value }));
  };

  const handleManageBookImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setManageBookForm((current) => ({ ...current, image: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setManageBookForm((current) => ({
        ...current,
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const refreshBooks = () => {
    setBooks(getStoredBooks());
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
    refreshBooks();
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
    refreshBooks();
    setMessage(`"${book.title}" was deleted.`);
  };

  const handleViewDescription = (book) => {
    setDescriptionBook(book);
  };

  const manageBooks = (book) => {
    setSelectedBook(book);
    setManageBookForm({
      title: book.title,
      author: book.author,
      image: book.image || "",
      status: book.status || "Available",
    });
    setManageImageInputKey((current) => current + 1);
    setManageBooksOpen(true);
  };

  const closeManageBooks = () => {
    setManageBooksOpen(false);
    setSelectedBook(null);
    setManageBookForm({
      title: "",
      author: "",
      image: "",
      status: "Available",
    });
  };

  const closeDescription = () => {
    setDescriptionBook(null);
  };

  const handleUpdateBook = (event) => {
    event.preventDefault();

    if (!selectedBook) {
      return;
    }

    if (!manageBookForm.title.trim() || !manageBookForm.author.trim()) {
      setMessage("Please enter both a book title and author.");
      return;
    }

    updateBook(selectedBook.id, {
      title: manageBookForm.title.trim(),
      author: manageBookForm.author.trim(),
      image: manageBookForm.image,
      status: manageBookForm.status,
    });

    refreshBooks();
    setMessage(`"${manageBookForm.title.trim()}" was updated successfully.`);
    closeManageBooks();
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-100 text-gray-900"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-24 right-6rem h-72 w-72 rounded-full blur-3xl ${
          theme === "dark" ? "bg-cyan-500/10" : "bg-sky-200/40"
        }`}
      />
      <div
        className={`pointer-events-none absolute bottom-0 left-5rem h-80 w-80 rounded-full blur-3xl ${
          theme === "dark" ? "bg-emerald-500/10" : "bg-emerald-200/35"
        }`}
      />
      <div className="relative flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r shadow-xl backdrop-blur transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900/90 shadow-black/20"
            : "border-white/70 bg-white/90 shadow-slate-200/60"
        }`}
      >
        <div
          className={`flex items-center gap-3 border-b p-4 ${
            theme === "dark" ? "border-slate-800" : "border-gray-200/70"
          }`}
        >
          <img src={logo} alt="SCAS logo" className="h-12 w-12" />
          <div>
            <p className="text-sm font-bold">SUMULONG COLLEGE</p>
            <p className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-gray-500"}>
              OF ARTS AND SCIENCE
            </p>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          <MenuItem label="Dashboard" active theme={theme} />
          <MenuItem label="Books" theme={theme} />
          <MenuItem label="Requests" theme={theme} />
          <MenuItem label="Students" theme={theme} />
          <MenuItem label="Announcements" theme={theme} />
          <MenuItem label="Reports" theme={theme} />
          <MenuItem label="Settings" theme={theme} />
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
        <header
          className={`border-b px-4 py-3 backdrop-blur transition-colors duration-300 md:px-6 ${
            theme === "dark"
              ? "border-slate-800 bg-slate-900/80"
              : "border-white/70 bg-white/80"
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm md:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="flex flex-col gap-1.5">
                  <span className={`block h-0.5 w-5 rounded-full ${theme === "dark" ? "bg-slate-100" : "bg-gray-800"}`} />
                  <span className={`block h-0.5 w-5 rounded-full ${theme === "dark" ? "bg-slate-100" : "bg-gray-800"}`} />
                  <span className={`block h-0.5 w-5 rounded-full ${theme === "dark" ? "bg-slate-100" : "bg-gray-800"}`} />
                </span>
              </button>

              <div className="flex items-center gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    Admin Dashboard
                  </p>
                  <h1 className={`text-xl font-bold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    Hi, Admin
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <form className="w-full md:w-96" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search books or requests..."
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm shadow-sm outline-none transition focus:ring-4 md:w-96 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
              </form>

              <div
                className={`hidden items-center gap-2 rounded-xl px-3 py-2 shadow-sm md:flex ${
                  theme === "dark"
                    ? "bg-cyan-500/10 text-slate-100"
                    : "bg-slate-900 text-white"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    theme === "dark"
                      ? "bg-cyan-500/20 text-cyan-200"
                      : "bg-white/15 text-white"
                  }`}
                >
                  A
                </div>
                <div className="text-sm">
                  <span className="block font-medium">Administrator</span>
                  <span
                    className={`block text-xs ${
                      theme === "dark" ? "text-slate-300/70" : "text-white/70"
                    }`}
                  >
                    Full access
                  </span>
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
                className={`rounded-2xl border p-4 shadow-lg backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                    : "border-white/70 bg-white/90 shadow-slate-200/60"
                }`}
              >
                <span className={`block text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  {stat.label}
                </span>
                <span className={`mt-2 block text-3xl font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  {stat.value}
                </span>
              </article>
            ))}
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <article className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                : "border-white/70 bg-white/90 shadow-slate-200/60"
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className={`text-base font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    Recent Books
                  </h2>
                  <p className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Latest catalog entries and statuses
                  </p>
                  {searchTerm.trim() && (
                    <p className={theme === "dark" ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-500"}>
                      Showing {filteredBooks.length} result
                      {filteredBooks.length === 1 ? "" : "s"} for{" "}
                      <span className={`font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                        {searchTerm.trim()}
                      </span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className={`rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                      : "border-gray-200 bg-gray-50 text-slate-700 hover:bg-gray-100"
                  }`}
                >
                  View all
                </button>
              </div>

              <form
                className={`mt-4 grid gap-3 rounded-2xl border p-4 ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-950/60"
                    : "border-gray-200 bg-slate-50"
                }`}
                onSubmit={handleAddBook}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleBookFormChange}
                    placeholder="Book title"
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                        : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                    }`}
                  />
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleBookFormChange}
                    placeholder="Author"
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                        : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                    }`}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <input
                    key={imageInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleBookImageChange}
                    className={`block w-full rounded-xl border px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-900 text-slate-100 file:bg-cyan-600 hover:file:bg-cyan-500"
                        : "border-gray-300 bg-white text-gray-900 file:bg-slate-900 hover:file:bg-slate-800"
                    }`}
                  />
                  <button
                    type="submit"
                    className={`rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                      theme === "dark"
                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    Add Book
                  </button>
                </div>

                <div className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-900"
                    : "border-gray-200 bg-white"
                }`}>
                  {bookForm.image ? (
                    <img
                      src={bookForm.image}
                      alt="Book cover preview"
                      className="h-16 w-12 rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <div className={`flex h-16 w-12 items-center justify-center rounded-lg text-[10px] font-medium ${
                      theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500"
                    }`}>
                      No cover
                    </div>
                  )}
                  <div>
                    <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                      Cover preview
                    </p>
                    <p className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                      Upload an image to use it as the book cover.
                    </p>
                  </div>
                </div>
              </form>

              {message && (
                <p className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
                  theme === "dark"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}>
                  {message}
                </p>
              )}

              <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <article
                      key={book.id}
                      className={`overflow-hidden rounded-2xl border shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
                        theme === "dark"
                          ? "border-slate-800 bg-slate-900 shadow-black/20"
                          : "border-white/70 bg-white shadow-slate-200/50"
                      }`}
                    >
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <div className={`flex h-52 w-full items-center justify-center text-sm font-medium ${
                          theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500"
                        }`}>
                          No cover
                        </div>
                      )}
                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className={theme === "dark" ? "text-sm font-semibold text-slate-100" : "text-sm font-semibold text-slate-900"}>
                              {book.title}
                            </h3>
                            <p className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-slate-500"}>{book.author}</p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm ${
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

                        <div
                          className={`mt-2 rounded-2xl border p-3 shadow-sm ${
                            theme === "dark"
                              ? "border-slate-800 bg-slate-950/60"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDescription(book)}
                              className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition ${
                                theme === "dark"
                                  ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              View Description
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book)}
                              className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>

                          <button
                            onClick={() => manageBooks(book)}
                            type="button"
                            className={`mt-2 cursor-pointer w-full rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition ${
                              theme === "dark"
                                ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            Edit Book
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={`rounded-2xl border px-4 py-8 text-center text-sm shadow-lg sm:col-span-2 ${
                    theme === "dark"
                      ? "border-slate-800 bg-slate-900 text-slate-400 shadow-black/20"
                      : "border-white/70 bg-white text-slate-500 shadow-slate-200/50"
                  }`}>
                    No books found.
                  </div>
                )}
              </section>
            </article>

            <aside className="space-y-4">
              <article className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
                theme === "dark"
                  ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                  : "border-white/70 bg-white/90 shadow-slate-200/60"
              }`}>
                <h2 className={`text-base font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Today&apos;s Activity
                </h2>
                <div className="mt-4 space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item}
                      className={`rounded-xl border p-3 text-sm shadow-sm ${
                        theme === "dark"
                          ? "border-slate-800 bg-slate-950 text-slate-300"
                          : "border-gray-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>

              <article className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
                theme === "dark"
                  ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                  : "border-white/70 bg-white/90 shadow-slate-200/60"
              }`}>
                <h2 className={`text-base font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Quick Action
                </h2>
                <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                  Review pending requests or add a new book record.
                </p>
                <button
                  type="button"
                  className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Open Requests
                </button>
              </article>
            </aside>
          </section>
        </main>
      </div>

      {manageBooksOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          onClick={closeManageBooks}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl shadow-slate-900/20 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-slate-100"
                : "border-white/70 bg-white text-slate-900"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <form onSubmit={handleUpdateBook} className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={manageBookForm.image || books1}
                  alt="Book management"
                  className="h-32 w-24 rounded-2xl object-cover shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    Manage Books
                  </h2>
                  <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                    Update the selected book details below.
                  </p>
                  {selectedBook && (
                    <p className={theme === "dark" ? "mt-2 text-xs text-slate-500" : "mt-2 text-xs text-slate-400"}>
                      Editing: {selectedBook.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="title"
                  value={manageBookForm.title}
                  onChange={handleManageBookFormChange}
                  placeholder="Book title"
                  className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
                <input
                  type="text"
                  name="author"
                  value={manageBookForm.author}
                  onChange={handleManageBookFormChange}
                  placeholder="Author"
                  className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="status"
                  value={manageBookForm.status}
                  onChange={handleManageBookFormChange}
                  className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Reserved">Reserved</option>
                </select>

                <input
                  key={manageImageInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handleManageBookImageChange}
                  className={`block w-full rounded-xl border px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 file:bg-cyan-600 hover:file:bg-cyan-500"
                      : "border-gray-300 bg-white text-gray-900 file:bg-slate-900 hover:file:bg-slate-800"
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeManageBooks}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-gray-100 ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                      : "border-gray-300 text-slate-700"
                  }`}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {descriptionBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          onClick={closeDescription}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl shadow-slate-900/20 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-slate-100"
                : "border-white/70 bg-white text-slate-900"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <img
                src={descriptionBook.image || books1}
                alt={descriptionBook.title}
                className="h-32 w-24 rounded-2xl object-cover shadow-md"
              />
                <div className="min-w-0 flex-1">
                <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  {descriptionBook.title}
                </h2>
                <p className={theme === "dark" ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-500"}>
                  by {descriptionBook.author}
                </p>
                <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                  theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                }`}>
                  {descriptionBook.status}
                </p>
              </div>
            </div>

            <div className={`mt-4 rounded-2xl border p-4 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-950 text-slate-300"
                : "border-gray-200 bg-slate-50 text-slate-700"
            }`}>
              <p className="text-sm leading-7">
                {descriptionBook.description ||
                  "No description available for this book yet."}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeDescription}
                className="cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function MenuItem({ label, active, theme }) {
  return (
    <div
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition ${
        active
          ? theme === "dark"
            ? "bg-slate-800 font-semibold text-slate-100"
            : "bg-gray-200 font-semibold text-gray-900"
          : theme === "dark"
            ? "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </div>
  );
}

export default AdminDashboard;
