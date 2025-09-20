import { useState } from "react";
import { auth } from "./../../firebaseconfig";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { db } from "./../../firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import { CheckSquare } from "lucide-react";
import "./../pages/AuthPage.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password))
      return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must include at least one lowercase letter.";
    if (!/[0-9]/.test(password))
      return "Password must include at least one number.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Please enter a valid email.";
      case "auth/weak-password":
        return "Password should be at least 8 characters.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled.";
      default:
        return "Something went wrong. Please try again.";
    }
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
        phone,
      });
      setSuccess("Account created successfully! ");
      setTimeout(() => navigate("/auth/sign-in"), 1500);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  return (
    <div className="p-4 border rounded-md w-full max-w-sm mx-auto shadow-md bg-white sm:my-8 px-4">
      <div>
        <div className="flex items-center justify-center gap-1 mb-6">
          <CheckSquare className="text-blue-950" size={20} />
          <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
            Task Manager
          </h1>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute eye-icon right-3 flex items-center text-gray-500 cursor-pointer "
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="absolute eye-icon right-3 flex items-center text-gray-500 cursor-pointer "
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
        >
          Sign Up
        </button>

        <p className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
