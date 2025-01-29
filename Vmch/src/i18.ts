import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Dashboard from "./Pages/Dashboard/Dashboard";

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
            title:"جنسیت",
            man:"مرد",
            woman:"زن",
            child:"کودک",
            both:"هر دو",
          },
          search:"جستجو",
          filter:{
            title:"فیلتر",
            gender:"جنسیت",
            category:"دسته بندی",
            apply:"اعمال",
            cancel:"لغو"
          },

          site:{
            name:"ومچ",
            where_does_it_hurt:"کجاته دوباره؟",
            wallet_balance:"موجودی کیف پول",
            request_doctor:"درخواست دکتر",
            request_doctor_guest:"درخواست دکتر برای فردی دیگر",
            not_enough_balance:"موجودی کافی نیست",
            dashboard:{
                title:"داشبورد",
                Sessions:"مشاوره ها",
                Notification:"پیام ها",
                Settings:"تنظیمات",
                Logout:"خروج",
                wallet_balance:"موجودی کیف پول",
                stats:"آمار",
                admin:"مدیر",
                patient:"بیمار",
                doctor:"دکتر",
                rating_description:"امتیاز این ماه",
                online_users:"کاربران آنلاین",
            },
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
            sign_in:{
            welcome:"خوش آمدید",
            email:"نام کاربری",
            password:"رمز عبور",
            forgot_password:"رمز عبور را فراموش کرده اید؟",
            enter_with_email:"ورود",
            or:"یا",
            dont_have_an_account:"حساب کاربری ندارید؟",
            create_account:"ساخت حساب",
            already_have_account:"حساب کاربری دارید؟",
            email_address_is_required:"ایمیل الزامی است",
            invalid_email_address:"آدرس ایمیل نامعتبر است",
            password_is_required:"رمز عبور الزامی است",
            password_must_be_at_least_8_characters:"رمز عبور باید حداقل 8 کاراکتر باشد",
            password_must_be_at_most_100_characters:"رمز عبور باید حداکثر 100 کاراکتر باشد",
            failed:"ورود ناموفق دوباره تلاش کنید",
            success:"ورود با موفقیت انجام شد",
            connection_error:"اتصال برقرار نشد",
          },
          sign_up:{
            title:"ثبت نام",
            already_have_account:"حساب کاربری دارید؟",
            email_address_is_required:"ایمیل الزامی است",
            invalid_email_address:"آدرس ایمیل نامعتبر است",
            password_is_required:"رمز عبور الزامی است",
            password_must_be_at_least_8_characters:"رمز عبور باید حداقل 8 کاراکتر باشد",
            password_must_be_at_most_100_characters:"رمز عبور باید حداکثر 100 کاراکتر باشد",
            full_name:"نام و نام خانوادگی",
            national_code:"کد ملی",
            birth_date:"تاریخ تولد",
            gender:"جنسیت",
            email:"ایمیل",
            password:"رمز عبور",
            phone_number:"شماره همراه",
            confirm_password:"تکرار رمز عبور",
            full_name_is_required:"نام و نام خانوادگی الزامی است",
            national_code_is_required:"کد ملی الزامی است",
            birth_date_is_required:"تاریخ تولد الزامی است",
            gender_is_required:"جنسیت الزامی است",
            email_is_required:"ایمیل الزامی است",
            phone_number_is_required:"شماره همراه الزامی است",
            confirm_password_is_required:"تکرار رمز عبور الزامی است",
            invalid_full_name:"نام و نام خانوادگی نامعتبر است",
            invalid_national_code:"کد ملی نامعتبر است",
            invalid_birth_date:"تاریخ تولد نامعتبر است",
            invalid_gender:"جنسیت نامعتبر است",
            invalid_email:"ایمیل نامعتبر است",
            invalid_phone_number:"شماره همراه نامعتبر است",
            invalid_password:"رمز عبور نامعتبر است",
            invalid_confirm_password:"تکرار رمز عبور نامعتبر است",
            password_and_confirm_password_dont_match:"رمز عبور و تکرار رمز عبور مطابقت ندارند",
            national_code_already_exists:"کد ملی قبلا ثبت شده است",
            age_must_be_at_least_13_years:"سن باید حداقل 13 سال باشد",
            are_you_a_doctor:"آیا دکتر هستید؟",
            already_have_an_account:"حساب کاربری دارید؟",
            login:"ورود",
            submit:"ثبت نام",
            medical_code:"کد پزشکی",
            doctor_sign_up:"لطفا برای ثبت نام در ومچ مشخصات خود را وارد کنید",
            failed:"ثبت نام ناموفق دوباره تلاش کنید",
            success:"ثبت نام با موفقیت انجام شد",
            conflict:"کد ملی و یا ایمیل قبلا ثبت شده است",
            connection_error:"اتصال برقرار نشد",
          }
        }

        }
      },
  en: {
    translation: {
      connecting: "Connecting",
      retrying: "Retrying",
      connected: "Connected",
      disconnect: "Failed to Connect",
      retry:"retry",
      gender:{
        title:"Gender",
        man:"Man",
        woman:"Woman",
        child:"Child",
        both:"Both",
        apply:"Apply",
        cancel:"Cancel"
      },
      search:"Search",
      filter:{
        title:"Filter",
        gender:"Gender",
        category:"Category",
        apply:"Apply",
        cancel:"Cancel"
      },

      site:{
        name:"Vmch",
        where_does_it_hurt:"What’s acting up this time?",
        wallet_balance:"Wallet Balance",
        request_doctor:"Request a Doctor",
        request_doctor_guest:"Request a Doctor for Someone Else",
        not_enough_balance:"Not enough balance",
        dashboard:{
            title:"Dashboard",
            Sessions:"Sessions",
            Notification:"Notification",
            Settings:"Settings",
            Logout:"Logout",
            wallet_balance:"Wallet Balance",
            stats:"Stats",
            admin:"Admin",
        patient:"Patient",
        doctor:"Doctor",
        rating_description:"This Months Rating",
        online_users:"Online Users",

        },
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
        sign_in:{
            welcome:"Welcome back",
            email:"Email",
            password:"Password",
            forgot_password:"Forgot your password?",
            enter_with_email:"Continue with Email",
            or:"or",
            dont_have_an_account:"Don't have an account?",
            create_account:"Create an account",
            already_have_account:"Already have an account?",
            email_address_is_required:"Email is required",
            invalid_email_address:"Invalid email address",
            password_is_required:"Password is required",
            password_must_be_at_least_8_characters:"Password must be at least 8 characters",
            password_must_be_at_most_100_characters:"Password must be at most 100 characters",
            failed:"Sign in failed, please try again",
            success:"Sign in successfully",
            connection_error:"Connection error",

        },sign_up:{
            title:"Sign up",
            already_have_account:"Already have an account?",
            email_address_is_required:"Email is required",
            invalid_email_address:"Invalid email address",
            password_is_required:"Password is required",
            password_must_be_at_least_8_characters:"Password must be at least 8 characters",
            password_must_be_at_most_100_characters:"Password must be at most 100 characters",
            full_name:"Full name",
            national_code:"National code",
            birth_date:"Birth date",
            gender:"Gender",
            email:"Email",
            password:"Password",
            phone_number:"Phone number",
            confirm_password:"Confirm password",
            full_name_is_required:"Full name is required",
            national_code_is_required:"National code is required",
            birth_date_is_required:"Birth date is required",
            gender_is_required:"Gender is required",
            email_is_required:"Email is required",
            phone_number_is_required:"Phone number is required",
            confirm_password_is_required:"Confirm password is required",
            invalid_full_name:"Invalid full name",
            invalid_national_code:"Invalid national code",
            invalid_birth_date:"Invalid birth date",
            invalid_gender:"Invalid gender",
            invalid_email:"Invalid email",
            invalid_phone_number:"Invalid phone number",
            invalid_password:"Invalid password",
            invalid_confirm_password:"Invalid confirm password",
            password_and_confirm_password_dont_match:"Password and confirm password don't match",
            national_code_already_exists:"National code already exists",
            age_must_be_at_least_13_years:"Age must be at least 13 years",
            are_you_a_doctor:"Are you a doctor?",
            already_have_an_account:"Already have an account?",
            login:"Login",
            submit:"Sign up",
            medical_code:"Medical code",
            doctor_sign_up:"Please enter your information to sign up in Vmch",
            failed:"Sign up failed, please try again",
            success:"Sign up successfully",
            conflict:"National code or email already exists",
            connection_error:"Connection error",
        }
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
