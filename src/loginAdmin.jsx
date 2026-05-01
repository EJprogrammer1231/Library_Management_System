import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showRecoveryHint, setShowRecoveryHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageBackground = {
    background:
      "radial-gradient(circle at top, #f8fafc 0%, #e2e8f0 45%, #cbd5e1 100%)",
  };

  const validate = (values) => {
    const nextErrors = {};
    const identifier = values.identifier.trim();
    const password = values.password;

    if (!identifier) {
      nextErrors.identifier = "Admin username or email is required.";
    } else if (identifier.includes("@")) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(identifier)) {
        nextErrors.identifier = "Enter a valid email address.";
      }
    } else if (identifier.length < 3) {
      nextErrors.identifier = "Username must be at least 3 characters.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setTouched({
      identifier: true,
      password: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate("/AdminDashboard");
    }, 1100);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setErrors(validate(nextFormData));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  return (
    <div className="min-h-screen text-slate-900" style={pageBackground}>
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <section className="w-full border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Welcome admin
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Login to admin account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your admin credentials to manage the SCAS academic course
              library.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Admin Username or Email
              </span>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your admin username"
                value={formData.identifier}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.identifier && errors.identifier)}
                aria-describedby="identifier-error"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {touched.identifier && errors.identifier && (
                <p id="identifier-error" className="mt-2 text-sm text-red-600">
                  {errors.identifier}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby="password-error"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {touched.password && errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Remember me
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                className="font-medium text-slate-900 hover:underline"
                onClick={() => setShowRecoveryHint((current) => !current)}
              >
                Forgot password?
              </button>
            </div>

            {showRecoveryHint && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                If you forgot your password, contact the rigestrar to ressolve the issue.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:bg-slate-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/70 disabled:cursor-wait disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {isSubmitting && (
              <p className="text-center text-sm text-slate-500">
                Verifying admin credentials...
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate("/ChooseCategory")}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Back to category
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginAdmin;
