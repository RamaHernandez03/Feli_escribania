import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("es")}>ES</button>
      <button onClick={() => changeLanguage("en")}>EN</button>
    </div>
  );
}

export default LanguageSwitcher;
