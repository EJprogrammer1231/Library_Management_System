import { useEffect, useState } from "react";
import logo from "./assets/Logo.png";

function Layout() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Failed to load books:", error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ===== ASIDE ===== */}
      <aside className={`
        fixed md:static top-0 left-0 h-full w-64 bg-white flex flex-col z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-4">
          <img src={logo} className="w-12 h-12" alt="logo" />
          <div className="leading-tight">
            <span className="block text-sm font-bold">
              SUMULONG COLLEGE
            </span>
            <span className="block text-xs text-gray-500">
              OF ARTS AND SCIENCE
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <MenuItem label="Dashboard" active />
          <MenuItem label="Course Materials" />
          <MenuItem label="Search Materials" />
          <MenuItem label="My Borrowed" />
          <MenuItem label="Favorites" />
          <MenuItem label="Announcements" />
          <MenuItem label="Help" />
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
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white">
          
          {/* Menu Button (mobile only) */}
          <button 
            className="md:hidden text-xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            Hi, <span>Students</span>
          </h1>

          {/* Search */}
          <div className="hidden md:flex">
            <input 
              type="text" 
              placeholder="Find materials..." 
              className="px-3 py-1 border rounded-lg text-sm outline-none w-80"
            />
            <button 
              className="ml-2 px-4 py-1 bg-blue-600 text-white rounded-sm text-sm hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full">
              S
            </div>
            <div className="text-sm">
              <span className="block font-medium text-gray-800">Student</span>
              <span className="block text-xs text-gray-500">BSIT 2A</span>
            </div>
          </div>

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
      className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition
        ${active 
          ? "bg-gray-200 text-gray-900 font-semibold" 
          : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      {label}
    </div>
  );
}

export default Layout;