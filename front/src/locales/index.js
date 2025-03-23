import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n"; 

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "es");

  useEffect(() => {
    i18n.changeLanguage(language); 
    localStorage.setItem("language", language); 
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
