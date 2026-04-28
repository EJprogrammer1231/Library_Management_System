import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";

function Layout() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
            <span className="block text-xs text-gray-500">
              OF ARTS AND SCIENCE
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 p-4">
          <MenuItem label="Dashboard" active/>
          <MenuItem label="Course Materials" />
          <MenuItem label="Search Materials" />
          <MenuItem label="My Borrowed" />
          <MenuItem label="Announcements" />
          <MenuItem label="Help" />
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
                <span className="block text-xs text-gray-500">BSIT 2A</span>
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
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 cursor-pointer"
            >
              Search
            </button>
          </form>
        </header>

        {/* CONTENT */}
        <main className="p-4 md:p-6">
          <div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
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
