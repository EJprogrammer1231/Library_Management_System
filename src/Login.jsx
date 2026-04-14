import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const pageBackground = {
    background:
      "radial-gradient(circle at top, #f8fafc 0%, #e2e8f0 45%, #cbd5e1 100%)",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen text-slate-900" style={pageBackground}>
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <section className="w-full rounded-2rem border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Login to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your credentials to continue to the SCAS academic course
              library system.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Username or Email
              </span>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your username"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Remember me
              </label>

              <button
                type="button"
                className="font-medium text-slate-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign In
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => navigate("/CreateAccount")}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Create an account
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
