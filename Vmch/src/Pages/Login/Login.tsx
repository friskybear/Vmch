import { Waves } from "@/Components/Waves/Waves";
import { AppContext } from "@/main";
import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FigmaIcon,
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { NavLink } from "react-router";
import { Separator } from "@/Components/Separator/Separator";
import { logo } from "@/icons";
import { useTranslation } from "react-i18next";
type Inputs = {
  email: string;
  password: string;
};
function Login() {
  const app = useContext(AppContext);
  const [t, _] = useTranslation();
  const [clicked, set_clicked] = useState(true);
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
    console.log(errors);
  }, [errors, clicked]);
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <div
      className={`h-screen w-screen text-text-800 bg-background-50 flex justify-center items-center ${
        app.appConfig.language === "en" ? "font-Roboto" : "font-fa"
      }`}
    >
      <Toaster richColors position="top-left" />
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
            {t("login.welcome")}
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
              {t("login.or")}
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
                {t("login.email")}
              </label>
              <input
                type="text"
                id="email"
                placeholder={t("login.email")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-72 shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("email", {
                  required: "Email Address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
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
                {t("login.password")}
              </label>
              <input
                type="password"
                placeholder={t("login.password")}
                id="password"
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-72 shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Password must be at most 50 characters",
                  },
                })}
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full btn btn-primary"
              onClick={() => {
                set_clicked((prev) => !prev);
              }}
            >
              {t("login.enter_with_email")}
            </button>
          </form>
          <div className="mt-5 space-y-5">
            <NavLink
              to={"/forgot_password"}
              className="text-sm block underline text-text-600 text-center"
            >
              {t("login.forgot_password")}
            </NavLink>
            <p className="text-sm text-center">
              {t("login.dont_have_an_account")}

              <NavLink to="/SignUp" className="ml-1 underline text-text-600">
                {t("login.create_account")}
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
