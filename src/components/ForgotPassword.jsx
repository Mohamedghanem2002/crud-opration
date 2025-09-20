import { useState } from "react";
import { auth } from "./../../firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import SpinnerOverlay from "./../components/SpinnerOverlay";
import toast from "react-hot-toast";
import { CheckSquare } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset link sent! Check your email.");
      toast.success("Reset link sent successfully!");
    } catch (err) {
      console.log("Firebase Error Code:", err.code);
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset email. Please try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <SpinnerOverlay loading={loading} />
      
      <div className="p-4 border rounded-md w-full max-w-sm mx-auto shadow-md bg-white">
        <div>
          <div className="flex items-center justify-center gap-1 mb-6">
            <CheckSquare className="text-blue-950" size={20} />
            <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
              Task Manager
            </h1>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="mt-3 text-center text-sm">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
