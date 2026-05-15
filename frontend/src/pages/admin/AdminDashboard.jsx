import { useEffect, useState } from "react";
import logo from "../../assets/Logo.png";
import books1 from "../../assets/books1.png";
import {
  addBook,
  getBorrowReserveReports,
  getBookCounts,
  getBookCopies,
  getStoredBooks,
  removeBook,
  updateBook,
} from "../../services/libraryBooks";
import { deleteStudentAccount, getStoredProfile, getStoredStudents } from "../../services/userProfile";

const COURSE_CATEGORIES = ["All", "BSIT", "BSCS", "BSBA", "BSED", "BEED", "BSTM", "BSHM", "General"];

function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("All");
  const [books, setBooks] = useState(() => getStoredBooks());
  const [reports, setReports] = useState(() => getBorrowReserveReports());
  const [students, setStudents] = useState(() => getStoredStudents());
  const theme = "light";

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "General",
    image: "",
    copies: "1",
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
    category: "General",
    copies: "1",
  });
  const [manageImageInputKey, setManageImageInputKey] = useState(0);

  const activity = [
    "under devloping",
    "under devloping",
    "under devloping",
  ];

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
      label: "Not Available",
      value: bookCounts.notAvailable.toString(),
      note: "Marked out of stock",
    },
    {
      label: "Available",
      value: bookCounts.available.toString(),
      note: "Ready to borrow",
    },
  ];

  const filteredBooks = books.filter((book) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      getBookCategory(book).toLowerCase().includes(query)
    );
  });

  const categorizedBooks = filteredBooks.filter(
    (book) => activeCategory === "All" || getBookCategory(book) === activeCategory,
  );

  const reportCounts = reports.reduce(
    (totals, report) => ({
      borrowed:
        totals.borrowed + (report.status === "Borrowed" ? Number(report.quantity) || 0 : 0),
      reserved:
        totals.reserved + (report.status === "Reserved" ? Number(report.quantity) || 0 : 0),
    }),
    { borrowed: 0, reserved: 0 },
  );

  const filteredStudents = students.filter((student) => {
    const query = studentSearchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      student.fullName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query) ||
      student.yearLevel.toLowerCase().includes(query) ||
      student.section.toLowerCase().includes(query)
    );
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveSection("books");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const syncBooks = () => setBooks(getStoredBooks());
    const syncReports = () => setReports(getBorrowReserveReports());
    const syncStudents = () => setStudents(getStoredStudents());
    const syncProfile = () => setProfile(getStoredProfile());

    syncBooks();
    syncReports();
    syncStudents();
    syncProfile();
    window.addEventListener("storage", syncBooks);
    window.addEventListener("storage", syncReports);
    window.addEventListener("storage", syncStudents);
    window.addEventListener("storage", syncProfile);
    window.addEventListener("scas-library-books-updated", syncBooks);
    window.addEventListener("scas-library-reports-updated", syncReports);
    window.addEventListener("scas-student-accounts-updated", syncStudents);
    window.addEventListener("scas-user-profile-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncBooks);
      window.removeEventListener("storage", syncReports);
      window.removeEventListener("storage", syncStudents);
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("scas-library-books-updated", syncBooks);
      window.removeEventListener("scas-library-reports-updated", syncReports);
      window.removeEventListener("scas-student-accounts-updated", syncStudents);
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
    setManageBookForm((current) => {
      if (name === "copies" && Number(value) === 0) {
        return { ...current, copies: value, status: "Not Available" };
      }

      if (name === "status" && value === "Not Available") {
        return { ...current, status: value, copies: "0" };
      }

      return { ...current, [name]: value };
    });
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
      category: bookForm.category,
      image: bookForm.image,
      copies: bookForm.copies,
    });

    setBookForm({ title: "", author: "", category: "General", image: "", copies: "1" });
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
      status: getBookCopies(book) === 0 ? "Not Available" : book.status || "Available",
      category: getBookCategory(book),
      copies: String(getBookCopies(book)),
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
      category: "General",
      copies: "1",
    });
  };

  const closeDescription = () => {
    setDescriptionBook(null);
  };

  const handleOpenReports = () => {
    setActiveSection("reports");
    setOpen(false);
  };

  const handleOpenDashboard = () => {
    setActiveSection("dashboard");
    setOpen(false);
  };

  const handleOpenBooks = () => {
    setActiveSection("books");
    setOpen(false);
  };

  const handleOpenStudents = () => {
    setActiveSection("students");
    setOpen(false);
  };

  const handleDownloadReportsPdf = () => {
    downloadReportsPdf(reports, reportCounts);
  };

  const handleDeleteStudent = (student) => {
    const confirmed = window.confirm(`Delete student account for ${student.fullName}?`);

    if (!confirmed) {
      return;
    }

    const nextStudents = deleteStudentAccount(student.id);
    setStudents(nextStudents);
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
      category: manageBookForm.category,
      copies: manageBookForm.copies,
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
          <MenuItem
            label="Dashboard"
            active={activeSection === "dashboard"}
            theme={theme}
            onClick={handleOpenDashboard}
          />
          <MenuItem
            label="Books"
            active={activeSection === "books"}
            theme={theme}
            onClick={handleOpenBooks}
          />
          <MenuItem label="Requests" theme={theme} />
          <MenuItem
            label="Students"
            active={activeSection === "students"}
            theme={theme}
            onClick={handleOpenStudents}
          />
          <MenuItem label="Announcements" theme={theme} />
          <MenuItem
            label="Reports"
            active={activeSection === "reports"}
            theme={theme}
            onClick={handleOpenReports}
          />
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
          {activeSection === "dashboard" ? (
            <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  onClick={handleOpenBooks}
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    name="category"
                    value={bookForm.category}
                    onChange={handleBookFormChange}
                    className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                      theme === "dark"
                        ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-cyan-400 focus:ring-cyan-500/20"
                        : "border-gray-300 bg-white text-gray-900 focus:border-slate-500 focus:ring-slate-200"
                    }`}
                  >
                    {COURSE_CATEGORIES.filter((category) => category !== "All").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="copies"
                    min="1"
                    value={bookForm.copies}
                    onChange={handleBookFormChange}
                    placeholder="Number of copies"
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
                            <p className={theme === "dark" ? "mt-1 text-xs font-semibold text-cyan-300" : "mt-1 text-xs font-semibold text-slate-600"}>
                              {getBookCategory(book)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm ${
                                book.status === "Borrowed"
                                  ? "bg-amber-100 text-amber-700"
                                  : book.status === "Reserved"
                                    ? "bg-sky-100 text-sky-700"
                                    : book.status === "Not Available"
                                      ? "bg-slate-200 text-slate-700"
                                      : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {book.status}
                            </span>
                            <span className={theme === "dark" ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                              {getBookCopies(book)} {getBookCopies(book) === 1 ? "copy" : "copies"}
                            </span>
                          </div>
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
                              className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-[11px] font-medium shadow-sm transition ${
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
                              className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700 shadow-sm transition hover:bg-red-100"
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
            </>
          ) : activeSection === "books" ? (
            <section className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                : "border-white/70 bg-white/90 shadow-slate-200/60"
            }`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Book Catalog
                  </p>
                  <h2 className={`mt-1 text-xl font-bold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-900"
                  }`}>
                    All Books
                  </h2>
                  <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                    Browse every book in the system by course category.
                  </p>
                </div>

                <div className={`rounded-xl border px-4 py-3 text-sm ${
                  theme === "dark" ? "border-slate-800 bg-slate-950 text-slate-300" : "border-gray-200 bg-slate-50 text-slate-600"
                }`}>
                  Showing {categorizedBooks.length} of {books.length} books
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {COURSE_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      activeCategory === category
                        ? theme === "dark"
                          ? "border-cyan-400 bg-cyan-500 text-slate-950"
                          : "border-slate-900 bg-slate-900 text-white"
                        : theme === "dark"
                          ? "border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800"
                          : "border-gray-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categorizedBooks.length > 0 ? (
                  categorizedBooks.map((book) => (
                    <article
                      key={book.id}
                      className={`overflow-hidden rounded-2xl border shadow-lg ${
                        theme === "dark"
                          ? "border-slate-800 bg-slate-900 shadow-black/20"
                          : "border-white/70 bg-white shadow-slate-200/50"
                      }`}
                    >
                      {book.image ? (
                        <img src={book.image} alt={book.title} className="h-48 w-full object-cover" />
                      ) : (
                        <div className={`flex h-48 w-full items-center justify-center text-sm font-medium ${
                          theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500"
                        }`}>
                          No cover
                        </div>
                      )}
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className={theme === "dark" ? "text-sm font-semibold text-slate-100" : "text-sm font-semibold text-slate-900"}>
                              {book.title}
                            </h3>
                            <p className={theme === "dark" ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>
                              {book.author}
                            </p>
                          </div>
                          <span className={theme === "dark" ? "rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"}>
                            {getBookCategory(book)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className={theme === "dark" ? "rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300" : "rounded-xl border border-gray-200 bg-slate-50 p-2 text-slate-600"}>
                            <span className="block text-[10px] uppercase">Status</span>
                            <strong>{book.status}</strong>
                          </div>
                          <div className={theme === "dark" ? "rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300" : "rounded-xl border border-gray-200 bg-slate-50 p-2 text-slate-600"}>
                            <span className="block text-[10px] uppercase">Copies</span>
                            <strong>{getBookCopies(book)}</strong>
                          </div>
                          <div className={theme === "dark" ? "rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-300" : "rounded-xl border border-gray-200 bg-slate-50 p-2 text-slate-600"}>
                            <span className="block text-[10px] uppercase">Reserved</span>
                            <strong>{Number(book.reservedCopies) || 0}</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDescription(book)}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                              theme === "dark"
                                ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => manageBooks(book)}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                              theme === "dark"
                                ? "border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={`rounded-2xl border px-4 py-10 text-center text-sm sm:col-span-2 xl:col-span-3 ${
                    theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-400" : "border-gray-200 bg-white text-slate-500"
                  }`}>
                    No books found in this category.
                  </div>
                )}
              </div>
            </section>
          ) : activeSection === "students" ? (
            <section className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                : "border-white/70 bg-white/90 shadow-slate-200/60"
            }`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Student Accounts
                  </p>
                  <h2 className={`mt-1 text-xl font-bold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-900"
                  }`}>
                    Registered Students
                  </h2>
                  <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                    View students with accounts, including course, year level, section, and contact details.
                  </p>
                </div>

                <div className={`rounded-xl border px-4 py-3 text-sm ${
                  theme === "dark" ? "border-slate-800 bg-slate-950 text-slate-300" : "border-gray-200 bg-slate-50 text-slate-600"
                }`}>
                  {filteredStudents.length} registered student{filteredStudents.length === 1 ? "" : "s"}
                </div>
              </div>

              <form className="mt-5 max-w-md" onSubmit={(event) => event.preventDefault()}>
                <label className={theme === "dark" ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-slate-700"}>
                  Search Students
                </label>
                <input
                  type="text"
                  value={studentSearchTerm}
                  onChange={(event) => setStudentSearchTerm(event.target.value)}
                  placeholder="Search by name, email, course, year, or section..."
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-sm shadow-sm outline-none transition focus:ring-4 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
              </form>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <article className={`rounded-xl border p-4 ${
                  theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-slate-50"
                }`}>
                  <span className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Total Accounts
                  </span>
                  <strong className={theme === "dark" ? "mt-2 block text-3xl text-slate-100" : "mt-2 block text-3xl text-slate-900"}>
                    {students.length}
                  </strong>
                </article>
                <article className={`rounded-xl border p-4 ${
                  theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-slate-50"
                }`}>
                  <span className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Active
                  </span>
                  <strong className={theme === "dark" ? "mt-2 block text-3xl text-slate-100" : "mt-2 block text-3xl text-slate-900"}>
                    {students.filter((student) => student.status === "Active").length}
                  </strong>
                </article>
                <article className={`rounded-xl border p-4 ${
                  theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-slate-50"
                }`}>
                  <span className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Courses
                  </span>
                  <strong className={theme === "dark" ? "mt-2 block text-3xl text-slate-100" : "mt-2 block text-3xl text-slate-900"}>
                    {new Set(students.map((student) => student.course)).size}
                  </strong>
                </article>
              </div>

              <div className={`mt-5 overflow-hidden rounded-2xl border ${
                theme === "dark" ? "border-slate-800" : "border-gray-200"
              }`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className={theme === "dark" ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}>
                      <tr>
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Course</th>
                        <th className="px-4 py-3 font-semibold">Year</th>
                        <th className="px-4 py-3 font-semibold">Section</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Joined</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800 bg-slate-900" : "divide-gray-200 bg-white"}`}>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-bold ${
                                  theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"
                                }`}>
                                  {student.avatar ? (
                                    <img src={student.avatar} alt={student.fullName} className="h-full w-full object-cover" />
                                  ) : (
                                    student.fullName.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span className="font-medium">{student.fullName}</span>
                              </div>
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {student.email}
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {student.course}
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {student.yearLevel}
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {student.section}
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {student.status}
                              </span>
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {formatShortDate(student.joinedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(student)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-8 text-center text-slate-500" colSpan="8">
                            No student accounts found yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <section className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/90 shadow-black/20"
                : "border-white/70 bg-white/90 shadow-slate-200/60"
            }`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Library Reports
                  </p>
                  <h2 className={`mt-1 text-xl font-bold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-900"
                  }`}>
                    Borrowed and Reserved Students
                  </h2>
                  <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                    Summary of students who borrowed or reserved books.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadReportsPdf}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Download PDF
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <article className={`rounded-xl border p-4 ${
                  theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-slate-50"
                }`}>
                  <span className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Total Borrowed
                  </span>
                  <strong className={theme === "dark" ? "mt-2 block text-3xl text-slate-100" : "mt-2 block text-3xl text-slate-900"}>
                    {reportCounts.borrowed}
                  </strong>
                </article>
                <article className={`rounded-xl border p-4 ${
                  theme === "dark" ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-slate-50"
                }`}>
                  <span className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                    Total Reserved
                  </span>
                  <strong className={theme === "dark" ? "mt-2 block text-3xl text-slate-100" : "mt-2 block text-3xl text-slate-900"}>
                    {reportCounts.reserved}
                  </strong>
                </article>
              </div>

              <div className={`mt-5 overflow-hidden rounded-2xl border ${
                theme === "dark" ? "border-slate-800" : "border-gray-200"
              }`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className={theme === "dark" ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}>
                      <tr>
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Course/Section</th>
                        <th className="px-4 py-3 font-semibold">Book</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Qty</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800 bg-slate-900" : "divide-gray-200 bg-white"}`}>
                      {reports.length > 0 ? (
                        reports.map((report) => (
                          <tr key={report.id}>
                            <td className="px-4 py-3 font-medium">{report.studentName}</td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {report.studentCourse}
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {report.bookTitle}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                report.status === "Borrowed"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-sky-100 text-sky-700"
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {report.quantity}
                            </td>
                            <td className={theme === "dark" ? "px-4 py-3 text-slate-300" : "px-4 py-3 text-slate-600"}>
                              {formatReportDate(report.date)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-8 text-center text-slate-500" colSpan="6">
                            No borrowed or reserved student records yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
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

              <select
                name="category"
                value={manageBookForm.category}
                onChange={handleManageBookFormChange}
                className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-950 text-slate-100 focus:border-cyan-400 focus:ring-cyan-500/20"
                    : "border-gray-300 bg-white text-gray-900 focus:border-slate-500 focus:ring-slate-200"
                }`}
              >
                {COURSE_CATEGORIES.filter((category) => category !== "All").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

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
                  <option value="Not Available">Not Available</option>
                </select>

                <input
                  type="number"
                  name="copies"
                  min="0"
                  value={manageBookForm.copies}
                  onChange={handleManageBookFormChange}
                  placeholder="Number of copies"
                  className={`rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-4 ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20"
                      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
              </div>

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

function getBookCategory(book) {
  return book?.category || "General";
}

function formatShortDate(date) {
  if (!date) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}

function formatReportDate(date) {
  if (!date) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function downloadReportsPdf(reports, counts) {
  const generatedAt = formatReportDate(new Date().toISOString());
  const rows = reports.length
    ? reports
    : [
        {
          studentName: "No records",
          studentCourse: "-",
          bookTitle: "-",
          status: "-",
          quantity: 0,
          date: new Date().toISOString(),
        },
      ];
  const pdfBlob = new Blob([buildReportsPdf(rows, counts, generatedAt)], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `library-borrow-reserve-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildReportsPdf(rows, counts, generatedAt) {
  const pageRows = chunkRows(rows, 24);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const pageObjectIds = [];

  pageRows.forEach((page, index) => {
    const pageObjectId = objects.length + 1;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(buildPdfStream(buildReportPageContent(page, counts, generatedAt, index + 1, pageRows.length)));
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  return assemblePdf(objects);
}

function buildReportPageContent(rows, counts, generatedAt, pageNumber, totalPages) {
  const commands = [
    pdfText(40, 555, "SCAS Library Borrowed and Reserved Report", 18),
    pdfText(40, 532, `Generated: ${generatedAt}`, 9),
    pdfText(580, 532, `Page ${pageNumber} of ${totalPages}`, 9),
    pdfText(40, 508, `Total Borrowed: ${counts.borrowed}`, 11),
    pdfText(200, 508, `Total Reserved: ${counts.reserved}`, 11),
    pdfText(40, 478, "Student", 10),
    pdfText(180, 478, "Course/Section", 10),
    pdfText(320, 478, "Book", 10),
    pdfText(530, 478, "Status", 10),
    pdfText(620, 478, "Qty", 10),
    pdfText(680, 478, "Date", 10),
  ];

  rows.forEach((report, index) => {
    const y = 455 - index * 17;
    commands.push(
      pdfText(40, y, trimPdfText(report.studentName, 22), 8),
      pdfText(180, y, trimPdfText(report.studentCourse, 20), 8),
      pdfText(320, y, trimPdfText(report.bookTitle, 32), 8),
      pdfText(530, y, report.status, 8),
      pdfText(620, y, String(report.quantity), 8),
      pdfText(680, y, formatReportDate(report.date), 8),
    );
  });

  return commands.join("\n");
}

function pdfText(x, y, text, size) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;
}

function buildPdfStream(content) {
  return `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
}

function assemblePdf(objects) {
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function chunkRows(rows, size) {
  const chunks = [];

  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }

  return chunks;
}

function escapePdfText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function trimPdfText(value, maxLength) {
  const text = String(value ?? "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function MenuItem({ label, active, theme, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition ${
        active
          ? theme === "dark"
            ? "bg-slate-800 font-semibold text-slate-100"
            : "bg-gray-200 font-semibold text-gray-900"
          : theme === "dark"
            ? "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            : "text-gray-700 hover:bg-gray-100"
      } w-full text-left`}
    >
      {label}
    </button>
  );
}

export default AdminDashboard;
