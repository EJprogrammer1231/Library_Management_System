import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/Logo.png";

function App() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const overviewRef = useRef(null);

  const navItems = ["Login", "Create an Account"];

  const handleNavigation = (item) => {
    setOpen(false);

    if (item === "Login") {
      navigate("/ChooseCategory");
    } else {
      navigate("/CreateAccount");
    }
  };

  const handleDemo = () => {
    navigate("/Watch-demo");
  };

  const handleOverview = () => {
    navigate("/Read-overview");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

          {/* TITLE */}
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="SCAS logo"
              className="h-12 w-12 shrink-0 p-1"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Sumulong College of Arts and Science
              </p>
              <h1 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                SCAS Academic Course Library
              </h1>
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            className="md:hidden border px-4 py-2 rounded-full cursor-pointer hover:bg-slate-100 active:bg-slate-200"
            onClick={() => setOpen(!open)}
          >
            Continue
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium hover:bg-slate-100"
                    onClick={() => handleNavigation(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* MOBILE NAV */}
        {open && (
          <div className="border-t px-4 md:hidden">
            <nav className="py-3">
              <ul className="grid gap-2">
                {navItems.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="block w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-slate-100"
                      onClick={() => handleNavigation(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* ================= MAIN ================= */}
      <main>
        <section className="relative overflow-hidden bg-linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)">

          <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">

            {/* LEFT CONTENT */}
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
                welcome to our library
              </p>

              <h2 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">
                SCAS Academic Course Library
              </h2>

              <p className="mt-6 text-base text-slate-700 sm:text-lg">
                SCAS Academic Course Library System helps students and instructors
                manage academic resources faster and more efficiently.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleOverview}
                  className="text-sm cursor-pointer rounded-full bg-slate-950 px-6 py-3 text-white hover:bg-slate-800"
                >
                  Read Overview
                </button>
                <button
                  type="button"
                  className="text-sm cursor-pointer rounded-full border px-6 py-3 hover:bg-slate-300"
                  onClick={handleDemo}
                >
                  Watch Demo
                </button>
              </div>
            </div>

            {/* RIGHT CARD */}
            <aside ref={overviewRef}>
              <div className="rounded-2xl border bg-white p-6 shadow-xl">
                <h3 className="text-xl font-bold">
                  Academic Resource Organization
                </h3>

                <ul className="mt-4 text-sm text-slate-600 space-y-2">
                  <li>• Faster searching of materials</li>
                  <li>• Better tracking of borrowed books</li>
                  <li>• Organized academic records</li>
                </ul>
              </div>
            </aside>

          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-slate-950 px-4 py-8 text-slate-200">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm">
            SCAS Academic Course Library | 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
