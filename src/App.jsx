import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);

  const navItems = ["Home", "About", "Login", "Sign-up"];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Sumulong College of Arts and Science
            </p>
            <h1 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              SCAS Academic Course Library System
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className={`border-t border-slate-200 bg-white px-4 md:hidden ${
            open ? "block" : "hidden"
          }`}
        >
          <nav className="mx-auto max-w-6xl py-3">
            <ul className="grid gap-2">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_70%)" />

          <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm">
                System Proposal
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                SCAS Academic Course Library System
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                A digital library management system for Sumulong College of Arts
                and Science that helps students and instructors find course
                materials faster, keep records organized, and manage academic
                resources in a more reliable way.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  View Proposal
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Read Overview
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Focus</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    Course-linked materials
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Model</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    Waterfall SDLC
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Audience</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    Students and faculty
                  </p>
                </div>
              </div>
            </div>

            <aside className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2rem bg-slate-900/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2rem border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Project Snapshot
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                      Academic resource organization
                    </h3>
                  </div>
                  <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    2026
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <section className="rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                      Purpose
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-100">
                      Connect library materials directly to course codes so
                      users can locate required and recommended readings with
                      less effort.
                    </p>
                  </section>

                  <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Institution</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        SCAS
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Platform</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        Web-based
                      </p>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-dashed border-slate-300 p-5">
                    <p className="text-sm font-semibold text-slate-700">
                      Core benefits
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                    <li>- Faster searching and filtering of materials</li>
                    <li>- Better monitoring of borrowed items</li>
                    <li>- Cleaner record keeping and reporting</li>
                    </ul>
                  </section>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Sumulong College of Arts and Science
            </p>
            <p className="mt-2 text-sm text-slate-300">
              SCAS Academic Course Library System
            </p>
          </div>

          <div className="text-sm text-slate-400">
            <p>System Proposal | February 2026</p>
            <p className="mt-1">
              Designed for academic resource organization and access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
