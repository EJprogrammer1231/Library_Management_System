import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";
import books1 from "./assets/books1.png";
import books2 from "./assets/books2.png";
import books3 from "./assets/books3.png";
import books4 from "./assets/books4.png";

function Layout() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const stats = [
    { label: "Total Books", value: "0", note: "All available records" },
    { label: "Borrowed", value: "0", note: "Currently checked out" },
    { label: "Reserved", value: "0", note: "Waiting for pickup" },
    { label: "Returned", value: "0", note: "Recently returned" },
  ];
  const books = [
    { title: "Atomic Habits", author: "James Clear", image: books1 },
    { title: "Clean Code", author: "Robert C. Martin", image: books2 },
    { title: "The Alchemist", author: "Paulo Coelho", image: books3 },
    { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", image: books4 },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Failed to load books:", error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchTerm.trim() === "") {
      alert("Please enter a materials.");
      return;
    }

    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* ===== ASIDE ===== */}
      <aside
        className={`
        fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white
        transform transition-transform duration-300 md:static
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4">
          <img src={logo} className="h-12 w-12" alt="logo" />
          <div className="leading-tight">
            <span className="block text-sm font-bold">SUMULONG COLLEGE</span>
            <span className="block text-xs font-medium text-gray-500">
              OF ARTS AND SCIENCE
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 p-4">
          <MenuItem label="Dashboard" active/>
          <MenuItem label="All Books" />
          <MenuItem label="Course Materials" />
          <MenuItem label="Announcements" />
          <MenuItem label="Profile" />
          <MenuItem label="Settings" />
          <MenuItem label="Logout" />
        </nav>
      </aside>

      {/* Overlay (click to close) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== MAIN ===== */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <header className="flex flex-col gap-3 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Menu Button (mobile only) */}
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

            <h1 className="flex-1 text-lg font-semibold text-gray-800 md:flex-none">
              Hi, <span>Students</span>
            </h1>

            {/* Profile */}
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white">
                S
              </div>
              <div className="text-sm">
                <span className="block font-medium text-gray-800">Student</span>
                <span className="block text-xs text-gray-500">BSIT-2</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <form
            className="flex w-full max-w-sm items-stretch gap-2"
            onSubmit={handleSearch}
          >
            <input
              id="input-search"
              type="text"
              placeholder="Find materials..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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

        {/* CONTENT */}
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

          {/* for a books recntly added and can view by a students */}
          <main>
            <section className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-gray-300 bg-white p-4 sm:flex-row sm:items-center">
              <button className="cursor-pointer rounded bg-gray-200 p-2 text-sm text-gray-800 hover:bg-gray-300 sm:w-auto w-full">
                View all Books
              </button>
              <span className="cursor-pointer rounded text-xs text-gray-500 hover:bg-gray-300 sm:w-auto w-full">
                - Weekly added -
                </span>
            </section>

            {/* Books images */}
            <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <article
                  key={book.title}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl hover:ring-gray-300"
                >
                  <div className="aspect-3/4 w-full overflow-hidden bg-gray-100">
                    <img
                      src={book.image}
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
                  <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0">
                    <img
                      src={books1}
                      alt="Atomic Habits"
                      className="h-14 w-10 flex-none rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        Atomic Habits
                      </h3>
                      <p className="truncate text-xs text-gray-500">
                        by James Clear
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                        New
                      </span>
                      <span className="text-sm text-slate-500">2024</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0">
                    <img
                      src={books2}
                      alt="Clean Code"
                      className="h-14 w-10 flex-none rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        Clean Code
                      </h3>
                      <p className="truncate text-xs text-gray-500">
                        by Robert C. Martin
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                        New
                      </span>
                      <span className="text-sm text-slate-500">2024</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-3">
                    <img
                      src={books3}
                      alt="The Alchemist"
                      className="h-14 w-10 flex-none rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        The Alchemist
                      </h3>
                      <p className="truncate text-xs text-gray-500">
                        by Paulo Coelho 
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                        New
                      </span>
                      <span className="text-sm text-slate-500">2024</span>
                    </div>
                  </div>
                </section>
              </article>
            </section>
          </main>
        </main>
      </div>
    </div>
  );
}

/* ===== MENU ITEM ===== */
function MenuItem({ label, active }) {
  return (
    <div
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition
        ${
          active
            ? "bg-gray-200 font-semibold text-gray-900"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </div>
  );
}

export default Layout;
