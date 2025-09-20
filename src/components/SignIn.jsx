import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./../../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CheckSquare } from "lucide-react";
import "./../pages/AuthPage.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const errorMessages = {
    "auth/invalid-email": "Please enter a valid email.",
    "auth/user-disabled": "This account has been disabled. Contact support.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/missing-password": "Password is required.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        })
      );

      console.log(email, password);
      navigate("/");
      window.location.reload();
    } catch (err) {
      const message =
        errorMessages[err.code] || "Login failed. Please try again.";
      console.log("Firebase Error Code:", err.code);
      setError(message);
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
      <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
      <form onSubmit={handleSignIn} className="flex flex-col gap-3">
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

        <div className="relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

        {error && (
          <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="mt-3 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/auth/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
