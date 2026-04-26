import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // Added loading state so account creation feels deliberate and professional.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageBackground = {
    background:
      "radial-gradient(circle at top, #f8fafc 0%, #e2e8f0 45%, #cbd5e1 100%)",
  };

  const validate = (values) => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (values.fullName.trim().length < 3) {
      nextErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Added a short loading delay so the user sees clear feedback before moving on.
    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate("/login");
    }, 1100);
  };

  return (
    <div className="min-h-screen text-slate-900" style={pageBackground}>
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Get started
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Register to access the SCAS academic course library system.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.fullName && errors.fullName)}
                aria-describedby="fullName-error"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {touched.fullName && errors.fullName && (
                <p id="fullName-error" className="mt-2 text-sm text-red-600">
                  {errors.fullName}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby="email-error"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {touched.email && errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {errors.email}
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
                placeholder="Create a password"
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

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(
                  touched.confirmPassword && errors.confirmPassword,
                )}
                aria-describedby="confirmPassword-error"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:bg-slate-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/70 disabled:cursor-wait disabled:opacity-80"
            >
              {/* Added the spinner and status text for the loading animation. */}
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            {isSubmitting && (
              // Added supporting status text so the loading state feels polished.
              <p className="text-center text-sm text-slate-500">
                Setting up your access...
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Back to login
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CreateAccount;
