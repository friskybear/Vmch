import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    fa: {
        translation: {
          connecting:"در حال اتصال",
          retrying:"تلاش مجدد",
          connected:"اتصال برقرار شد",
          disconnect:"اتصال برقرار نشد"

        }
      },
  en: {
    translation: {
      connecting: "Connecting",
      retrying: "Retrying",
      connected: "Connected",
      disconnect: "Disconnected"
    }
  }

};

i18n
  .use(initReactI18next)
  .init({
    resources,
    debug:true,
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
