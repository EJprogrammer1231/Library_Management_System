function ChooseCategory() {
  const adminUrl = import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:5174/loginAdmin";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-center text-2xl font-bold">SELECT AS USER</h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Select how you want to continue.
          </p>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => window.location.assign("/login")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => window.location.assign(adminUrl)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Admin
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="mt-6 w-full text-center text-sm text-slate-500 hover:underline"
          >
            Back to home
          </button>
        </section>
      </div>
    </main>
  );
}

export default ChooseCategory;
