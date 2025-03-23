import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationES from './locales/es.json';
import translationEN from './locales/en.json';

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Integración con React
  .init({
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN }
    },
    lng: 'es', // Idioma predeterminado
    fallbackLng: 'es', // Si no encuentra el idioma, usa español
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
