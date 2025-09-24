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

  // const isValidPhoneNumber = (phone) => {
  //   const cleaned = phone.trim();
  //   const phoneRegex = /^\+?\d{10,15}$/;
  //   return phoneRegex.test(cleaned);
  // };

  // const validateForm = () => {
  //   if (!name.trim()) return t("auth.nameRequired");
  //   if (!email) return t("auth.emailRequired");
  //   if (!/\S+@\S+\.\S+/.test(email)) return t("auth.invalidEmail");
  //   if (!phone) return t("auth.phoneRequired");
  //   if (!isValidPhoneNumber(phone)) return t("auth.invalidPhone");
  //   if (!password) return t("auth.passwordRequired");
  //   if (password.length < 8) return t("auth.passwordRequirements");
  //   if (!confirmPassword) return t("auth.confirmPasswordRequired");
  //   if (password !== confirmPassword) return t("auth.passwordsDontMatch");
  //   return null;
  // };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   const validationError = validateForm();
  //   if (validationError) {
  //     setError(validationError);
  //     return;
  //   }
  const [errors, setErrors] = useState({});

  const isValidPhoneNumber = (phone) => {
    const cleaned = phone.trim();
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(cleaned);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = t("auth.nameRequired");
    if (!email) newErrors.email = t("auth.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = t("auth.invalidEmail");

    if (!phone) newErrors.phone = t("auth.phoneRequired");
    else if (!isValidPhoneNumber(phone))
      newErrors.phone = t("auth.invalidPhone");

    if (!password) newErrors.password = t("auth.passwordRequired");
    else if (password.length < 8)
      newErrors.password = t("auth.passwordRequirements");

    if (!confirmPassword)
      newErrors.confirmPassword = t("auth.confirmPasswordRequired");
    else if (password !== confirmPassword)
      newErrors.confirmPassword = t("auth.passwordsDontMatch");

    return newErrors;
  };

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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

  if (loading) return <SpinnerOverlay />;

  return (
    <>
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

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("auth.signUpName")}
          </label>
          <input
            type="text"
            className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 shadow-sm text-sm
      ${
        errors.name
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("auth.signUpEmail")}
          </label>
          <input
            type="email"
            className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 shadow-sm text-sm
      ${
        errors.email
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("auth.phoneNumber")}
          </label>
          <input
            type="tel"
            className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 shadow-sm text-sm
      ${
        errors.phone
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="relative mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("auth.signUpPassword")}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full border rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 shadow-sm text-sm
      ${
        errors.password
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="relative mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("auth.signUpConfirmPassword")}
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full border rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 shadow-sm text-sm
      ${
        errors.confirmPassword
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
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
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition"
          disabled={loading}
        >
          {t("auth.signUpSubmit")}
        </button>

        <p className="mt-3 text-center text-sm">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </form>
    </>
  );
}
