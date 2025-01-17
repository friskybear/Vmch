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
          disconnect:"اتصال برقرار نشد",
          retry:"تلاش مجدد",
          gender:{
            man:"مرد",
            woman:"زن",
            child:"کودک",
          },
          site:{
            name:"ومچ",
            where_does_it_hurt:"کجاته دوباره؟",
            tabs:{
                doctor:"دکترها",
                about_us:"درباره ما",
                contact:"تماس با ما",
                sign_in:"ورود",
                sign_up:"ثبت نام",
                sign_out:"خروج",
                dashboard:"داشبورد",
                sessions:"مشاوره ها",
                notification:"پیام ها",
                home:"خانه"
            }
          },
          login:{
            welcome:"خوش آمدید",
            email:"نام کاربری",
            password:"رمز عبور",
            forgot_password:"رمز عبور را فراموش کرده اید؟",
            enter_with_email:"ورود",
            or:"یا",
            dont_have_an_account:"حساب کاربری ندارید؟",
            create_account:"ساخت حساب",
            already_have_account:"حساب کاربری دارید؟"
          }

        }
      },
  en: {
    translation: {
      connecting: "Connecting",
      retrying: "Retrying",
      connected: "Connected",
      disconnect: "Disconnected",
      retry:"retry",
      gender:{
        man:"Man",
        woman:"Woman",
        child:"Child",
      },
      site:{
        name:"Vmch",
        where_does_it_hurt:"What’s acting up this time?",
        tabs:{
            doctor:"Doctors",
            about_us:"About Us",
            contact:"Contact",
            sign_in:"Sign in",
            sign_up:"Sign up",
            sign_out:"Log out",
            dashboard:"Dashboard",
            sessions:"Sessions",
            notification:"Notification"
            ,home:"home"
        }
      },
      login:{
      welcome:"Welcome back",
            email:"Email",
            password:"Password",
            forgot_password:"Forgot your password?",
            enter_with_email:"Continue with Email",
            or:"or",
            dont_have_an_account:"Don't have an account?",
            create_account:"Create an account",
            already_have_account:"Already have an account?"
      }
    }
  }

};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
