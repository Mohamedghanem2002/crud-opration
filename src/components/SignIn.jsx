import { useState } from "react";
import { auth } from "../../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SpinnerOverlay from "./../components/SpinnerOverlay";
import { useTranslation } from "react-i18next";
import { CheckSquare } from "lucide-react";
import "./../pages/AuthPage.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError(t("auth.emailRequired"));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        })
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Sign in error:", err);
      setError(
        err.code === "auth/invalid-credential"
          ? t("auth.errors.invalidCredentials")
          : t("auth.errors.signInError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SpinnerOverlay loading={loading} />
      <div className="p-4 border rounded-md w-full max-w-sm mx-auto shadow-md bg-white sm:my-8 px-4">
        <div>
          <div className="flex items-center justify-center gap-1 mb-6">
            <CheckSquare className="text-blue-950" size={20} />
            <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
              {t("appName")}
            </h1>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">
          {t("auth.signIn")}
        </h2>
        <form onSubmit={handleSignIn} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.signInEmail")}
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              {t("auth.signInPassword")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute eye-icon right-3 flex items-center text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {t("auth.signInSubmit")}
          </button>

          <div className="text-center text-sm">
            <Link
              to="/auth/forgot-password"
              className="text-blue-600 hover:underline"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <p className="mt-3 text-center text-sm">
            {t("auth.dontHaveAccount")}
            <Link to="/auth/sign-up" className="text-blue-600 hover:underline">
              {t("auth.signUp")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
