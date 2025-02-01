import { Waves } from "@/Components/Waves/Waves";
import { AppContext } from "@/main";
import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Loader from "@/Components/Loader/Loader";
import {
  FigmaIcon,
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { Separator } from "@/Components/Separator/Separator";
import { logo } from "@/icons";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { Admin, Doctor, Patient } from "@/lib/utils";
type Inputs = {
  email: string;
  password: string;
};
function SignIn() {
  const app = useContext(AppContext);
  const [t, _] = useTranslation();
  const [clicked, set_clicked] = useState(true);
  const [disabled, set_disabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    if (errors.email?.message) {
      toast.error(errors.email?.message);
    } else if (errors.password?.message) {
      toast.error(errors.password.message);
    }
  }, [errors, clicked]);
  useEffect(() => {}, [app.appConfig]);
  const nav = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    set_disabled(true);
    let password = await invoke<string>("argon2", { password: data.password });
    invoke<JSON | "Unauthorized">("post", {
      url: `${app.appConfig.server}/sign_in`,
      payload: { email: data.email, password: password, verify: false },
    }).then(async (res) => {
      if (res === "Unauthorized") {
        toast.error(t("login.sign_in.failed"));
        set_disabled(false);
        //@ts-ignore
      } else if (res["Doctor"] || res["Admin"] || res["Patient"]) {
        toast.success(t("login.sign_in.success"));
        await new Promise((resolve) => setTimeout(resolve, 2000));

        //@ts-ignore
        if (res["Doctor"]) {
          //@ts-ignore
          const doctor = res["Doctor"];
          //@ts-ignore
          doctor["password"] = password;
          const user: Doctor = new Doctor(doctor);
          user.id = user.id.toString();
          app.setAppConfig({
            ...app.appConfig,
            user: user,
            is_phone: app.appConfig.is_phone,
          });
          //@ts-ignore
        } else if (res["Admin"]) {
          //@ts-ignore
          const admin = res["Admin"];
          //@ts-ignore
          admin["password"] = password;
          const user: Admin = new Admin(admin);
          user.id = user.id.toString();
          app.setAppConfig({
            ...app.appConfig,
            user: user,
            is_phone: app.appConfig.is_phone,
          });
          //@ts-ignore
        } else if (res["Patient"]) {
          //@ts-ignore
          const patient = res["Patient"];
          //@ts-ignore
          patient["password"] = password;
          const user: Patient = new Patient(patient);
          user.id = user.id.toString();
          app.setAppConfig({
            ...app.appConfig,
            user: user,
            is_phone: app.appConfig.is_phone,
          });
        }
        nav("/Dashboard");
      } else {
        toast.error(t("login.sign_in.connection_error"));
        set_disabled(false);
      }
    });
  };
  return (
    <div
      className={`h-screen w-screen text-text-800 bg-background-50 flex justify-center items-center ${
        app.appConfig.language === "en" ? "font-Roboto" : "font-fa"
      }`}
    >
      <Toaster
        richColors
        position="top-left"
        visibleToasts={100}
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      />
      <section className="hidden md:flex w-[50dvw]  h-screen">
        <Waves
          lineColor={
            app.appConfig.theme === "dark"
              ? "rgba(75, 240, 221,1)"
              : "rgba(8, 138, 119,1)"
          }
          backgroundColor={
            app.appConfig.theme === "dark"
              ? "rgba(54, 103, 108,1)"
              : "rgba(156, 201, 194,1)"
          }
          waveSpeedX={0.03}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.5}
          tension={0.1}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
          className="w-[50dvw] p-3 [mask-image:radial-gradient(50dvw_circle_at_center,#ffffffcc_0%,#ffffff99_20%,#ffffff66_40%,#ffffff33_60%,#ffffff11_80%,transparent)] blur-[.5px]"
        />
      </section>
      <section className="h-screen w-screen md:w-[50dvw] ">
        <div className=" h-screen w-full flex flex-col items-center justify-center">
          {logo(45)}
          <p className="mt-4 text-xl font-bold tracking-tight">
            {t("login.sign_in.welcome")}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button className="rounded-full h-10 w-10 btn-outline border-text-800 hover:bg-text-800 border-text-800 hover:bg-text-800 flex justify-center items-center btn p-0 btn-circle min-h-0">
              <GithubIcon className="!h-[18px] !w-[18px]" />
            </button>
            <button className="rounded-full h-10 w-10 btn-outline border-text-800 hover:bg-text-800 flex justify-center items-center btn p-0 btn-circle min-h-0">
              <InstagramIcon className="!h-[18px] !w-[18px]" />
            </button>
            <button className="rounded-full h-10 w-10 btn-outline border-text-800 hover:bg-text-800 flex justify-center items-center btn p-0 btn-circle min-h-0">
              <TwitterIcon className="!h-[18px] !w-[18px]" />
            </button>
            <button className="rounded-full h-10 w-10 btn-outline border-text-800 hover:bg-text-800 flex justify-center items-center btn p-0 btn-circle min-h-0">
              <FigmaIcon className="!h-[18px] !w-[18px]" />
            </button>
            <button className="rounded-full h-10 w-10 btn-outline border-text-800 hover:bg-text-800 flex justify-center items-center btn p-0 btn-circle min-h-0">
              <TwitchIcon className="!h-[18px] !w-[18px]" />
            </button>
          </div>
          <div className="my-3 w-72 flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="flex justify-center px-4 text-sm font-bold text-text-800">
              {t("login.sign_in.or")}
            </span>

            <Separator />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
              >
                {t("login.sign_in.email")}
              </label>
              <input
                type="text"
                id="email"
                placeholder={t("login.sign_in.email")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-72 shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("email", {
                  required: t("login.sign_in.email_address_is_required"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("login.sign_in.invalid_email_address"),
                  },
                })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
              >
                {t("login.sign_in.password")}
              </label>
              <input
                type="password"
                placeholder={t("login.sign_in.password")}
                id="password"
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-72 shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("password", {
                  required: t("login.sign_in.password_is_required"),
                  minLength: {
                    value: 8,
                    message: t(
                      "login.sign_in.password_must_be_at_least_8_characters"
                    ),
                  },
                  maxLength: {
                    value: 100,
                    message: t(
                      "login.sign_in.password_must_be_at_most_100_characters"
                    ),
                  },
                })}
              />
            </div>
            <button
              type="submit"
              id="submit_button"
              className="mt-4 w-full btn btn-primary"
              disabled={disabled}
              onClick={() => {
                set_clicked((prev) => !prev);
              }}
            >
              {disabled && (clicked || true) ? (
                <Loader size={40} color={[6, 147, 126]} />
              ) : (
                t("login.sign_in.enter_with_email")
              )}
            </button>
          </form>
          <div className="mt-5 space-y-5">
            <NavLink
              to="/ForgotPassword"
              className="text-sm block underline text-text-600 text-center"
            >
              {t("login.sign_in.forgot_password")}
            </NavLink>
            <p className="text-sm text-center">
              {t("login.sign_in.dont_have_an_account")}

              <NavLink to="/SignUp" className="ml-1 underline text-text-600">
                {t("login.sign_in.create_account")}
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
