import { useState } from "react";
import { auth } from "./../../firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import SpinnerOverlay from "./SpinnerOverlay";
import toast from "react-hot-toast";
import { CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaEnvelope } from "react-icons/fa6";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError(t("auth.emailRequired"));
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(t("auth.resetLinkSent"));
      toast.success(t("auth.resetLinkSent"));
    } catch (err) {
      console.log("Firebase Error Code:", err.code);
      if (err.code === "auth/user-not-found") {
        setError(t("auth.userNotFound"));
      } else if (err.code === "auth/invalid-email") {
        setError(t("auth.invalidEmail"));
      } else {
        setError(t("auth.resetPasswordError"));
      }
    }

    setLoading(false);
  };
    if (loading) return <SpinnerOverlay />;
  

  // return (
  //   <>
  //     <div className="p-4 border rounded-md w-full max-w-sm mx-auto shadow-md bg-white">
  //       <div>
  //         <div className="flex items-center justify-center gap-1 mb-6">
  //           <CheckSquare className="text-blue-950" size={20} />
  //           <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
  //             {t("appName")}
  //           </h1>
  //         </div>
  //       </div>
  //       <h2 className="text-2xl font-semibold text-center mb-4">
  //         {t("auth.forgotPassword")}
  //       </h2>

  //       <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
  //         <div>
  //           <label className="block text-sm font-medium mb-1">
  //             {t("auth.forgotPasswordEmail")}
  //           </label>
  //           <input
  //             type="email"
  //             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //           />
  //         </div>

  //         {error && (
  //           <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
  //             {error}
  //           </div>
  //         )}
  //         {success && (
  //           <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
  //             {success}
  //           </div>
  //         )}

  //         <button
  //           type="submit"
  //           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
  //           disabled={loading}
  //         >
  //           {loading ? t("common.sending") : t("auth.forgotPasswordSubmit")}
  //         </button>

  //         <p className="mt-3 text-center text-sm">
  //           {t("auth.rememberPassword")}
  //           <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
  //             {t("auth.signIn")}
  //           </Link>
  //         </p>
  //       </form>
  //     </div>
  //   </>
  // );
  return (
    <>
      <SpinnerOverlay loading={loading} />

      <div>
        <div className="flex items-center justify-center gap-1 mb-6">
          <CheckSquare className="text-blue-950" size={20} />
          <h1 className="text-xl font-extrabold tracking-wide text-blue-950">
            {t("appName")}
          </h1>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-4">
        {t("auth.forgotPassword")}
      </h2>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("auth.forgotPasswordEmail")}
          </label>
          <div className="relative">
            <input
              type="email"
              className="w-full border rounded-xl px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          </div>
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
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t("common.sending") : t("auth.forgotPasswordSubmit")}
        </button>

        <p className="mt-3 text-center text-sm">
          {t("auth.rememberPassword")}{" "}
          <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </form>
    </>
  );

}

export default ForgotPassword;
