import { useState } from "react";
import { auth, db } from "./../../firebaseconfig";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import SpinnerOverlay from "./../components/SpinnerOverlay";
import { CheckSquare } from "lucide-react";
import "./../pages/AuthPage.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!name.trim()) return t("auth.nameRequired");
    if (!email) return t("auth.emailRequired");
    if (!/\S+@\S+\.\S+/.test(email)) return t("auth.invalidEmail");
    if (!phone) return t("auth.phoneRequired");
    if (!password) return t("auth.passwordRequired");
    if (password.length < 8) return t("auth.passwordRequirements");
    if (!confirmPassword) return t("auth.confirmPasswordRequired");
    if (password !== confirmPassword) return t("auth.passwordsDontMatch");
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        phones: [phone], 
        bio: "",
        role: "",
        dob: "",
        links: [],
        memberSince: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        completedTasks: 0,
        pendingTasks: 0,
        projectsCount: 0,
      });
      setSuccess(t("auth.accountCreated"));
      setTimeout(() => navigate("/auth/sign-in"), 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.code === "auth/email-already-in-use"
          ? t("auth.emailInUse")
          : t("auth.registrationError")
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
          {t("auth.signUp")}
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.signUpName")}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.signUpEmail")}
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.phoneNumber")}
            </label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              {t("auth.signUpPassword")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              {t("auth.signUpConfirmPassword")}
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute eye-icon right-3 flex items-center text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {t("auth.signUpSubmit")}
          </button>

          <p className="mt-3 text-center text-sm">
            {t("auth.alreadyHaveAccount")}
            <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
              {t("auth.signIn")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
