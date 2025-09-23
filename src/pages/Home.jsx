import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useTranslation } from "react-i18next";

function Home() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100 mb-8">
      <Navbar />
      <div className="flex flex-col flex-1 mt-20">
        <main className="flex-1 p-6 overflow-y-auto mt-16 md:mt-0">
          {location.pathname === "/" ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-extrabold text-slate-800">
                {t("welcome")}{" "}
                <span className="text-blue-600">{t("appName")}</span> 🎉
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-lg">
                {t("description")}
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="/tasks"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {t("getStarted")}
                </a>
                <a
                  href="/dashboard"
                  className="px-6 py-3 bg-gray-200 text-slate-700 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
                >
                  {t("viewDashboard")}
                </a>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
