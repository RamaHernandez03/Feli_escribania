import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      services: "Services",
      contact: "Contact",
      about: "About Us",
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      services: "Servicios",
      contact: "Contacto",
      about: "Nosotros",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "es", // Cargar idioma guardado
  interpolation: { escapeValue: false }
});

export default i18n;
