import React from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    // The language change and direction will be handled by the i18n.on('languageChanged') event
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("settings")}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{t("language")}</h2>
        <button
          onClick={toggleLanguage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          {t("switchLang")}
        </button>
        <p className="mt-2 text-sm text-gray-500">
          {t("currentLanguage")}: {i18n.language === 'en' ? 'English' : 'العربية'}
        </p>
      </div>
    </div>
  );
}
