import logo from "./assets/Logo.png";

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* ===== ASIDE ===== */}
      <aside className="w-64 bg-white flex flex-col">

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

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 bg-white">
          
          <h1 className="text-lg font-semibold text-gray-800">
            Hi, <span>Students</span>
          </h1>

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
        <main className="p-6">
          <p className="text-gray-600">
            Your dashboard content goes here...
          </p>
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