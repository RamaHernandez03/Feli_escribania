import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../locales/index";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Si el usuario hace scroll más de 50px, cambia el estado
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <label className="relative inline-flex cursor-pointer select-none items-center">
      <input
        type="checkbox"
        checked={language === "en"}
        onChange={handleToggle}
        className="sr-only"
      />
      <span
        className={`label flex items-center text-sm font-bold transition-colors duration-300 ${
          scrolled ? "text-[#222222]" : "text-[#F5F1EB]"
        }`}
      >
        ES
      </span>
      <span
        className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 transition duration-200 ${
          language === "es" ? "bg-[#D1AE85]" : "bg-[#A67C52]"
        }`}
      >
        <span
          className={`dot h-6 w-6 rounded-full bg-[#F5F1EB] transition duration-200 ${
            language === "es" ? "" : "translate-x-[28px]"
          }`}
        ></span>
      </span>
      <span
        className={`label flex items-center text-sm font-bold transition-colors duration-300 ${
          scrolled ? "text-[#222222]" : "text-[#F5F1EB]"
        }`}
      >
        EN
      </span>
    </label>
  );
};

export default LanguageSwitcher;
