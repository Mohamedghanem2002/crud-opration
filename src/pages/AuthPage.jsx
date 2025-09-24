import { useParams, Navigate } from "react-router-dom";
import SignIn from "./../components/SignIn";
import SignUp from "./../components/SignUp";
import ForgotPassword from "./../components/ForgotPassword";
import { useTranslation } from "react-i18next";
import { CheckSquare } from "lucide-react";

function AuthPage() {
  const { type } = useParams();
  const { t } = useTranslation();

  if (type !== "sign-in" && type !== "sign-up" && type !== "forgot-password")
    return <Navigate to="/auth/sign-in" replace />;
  return (
    <div className="min-h-screen flex flex-col justify-center md:flex-row bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white p-10 rounded-r-3xl">
        <div className="max-w-lg text-center space-y-6">
          {/* Logo & Title */}
          <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold text-white">
            <CheckSquare className="text-white" size={30} />
            {t("appName")}
          </h1>

          {/* Subtitle */}
          <p className="text-sm leading-relaxed opacity-90 w-10/12 mx-auto">
            {type === "sign-in" &&
              t(
                "Welcome back! Sign in to continue and pick up right where you left off."
              )}
            {type === "sign-up" &&
              t(
                "Create your account today and unlock access to all our features and community."
              )}
            {type === "forgot-password" &&
              t(
                "Don’t worry if you forgot your password — enter your email and reset it securely."
              )}
          </p>

          {/* Illustration */}
          <div className="w-full">
            <img
              src="/images/auth-image.png"
              alt="auth"
              loading="lazy"
              className="w-full drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
          {type === "sign-in" && <SignIn />}
          {type === "sign-up" && <SignUp />}
          {type === "forgot-password" && <ForgotPassword />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
