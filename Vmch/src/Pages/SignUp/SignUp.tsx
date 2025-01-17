import { Waves } from "@/Components/Waves/Waves";
import { AppContext } from "@/main";
import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Toaster, toast } from "sonner";
import { NavLink } from "react-router";
import { logo } from "@/icons";
import { useTranslation } from "react-i18next";
type Inputs = {
  full_name: string;
  national_code: string;
  birth_date: Date;
  gender: string;
  email: string;
  password: string;
  phone_number: string;
  confirm_password: string;
};
function SignUp() {
  const app = useContext(AppContext);
  const [t, _] = useTranslation();
  const [clicked, set_clicked] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
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
      <Toaster richColors position="top-right" />
      <section className="h-screen w-screen md:w-[50dvw] ">
        <div className=" h-screen w-full flex flex-col items-center justify-center p-5">
          {logo(45)}
          <p className="mt-4 text-xl font-bold tracking-tight">
            {t("login.sign_up")}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-row gap-3">
              <input
                type="text"
                id="full_name"
                placeholder={t("signup.full_name")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("full_name", {
                  required: t("signup.required_field"),
                })}
              />

              {/* National Code */}

              <input
                type="text"
                id="national_code"
                placeholder={t("signup.national_code")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-60 shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("national_code", {
                  required: t("signup.required_field"),
                })}
              />
            </div>
            <div className="mb-4 flex flex-row gap-3">
              <input
                type="date"
                id="birth_date"
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("birth_date", {
                  required: t("signup.required_field"),
                })}
              />

              <input
                type="tel"
                id="phone_number"
                placeholder={t("signup.phone_number")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("phone_number", {
                  required: t("signup.required_field"),
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: t("signup.invalid_phone"),
                  },
                })}
              />
            </div>
            {/* Gender */}
            <div className="mb-4 flex flex-row gap-4">
              <select
                id="gender"
                className={`mt-1 h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-44 ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("gender", {
                  required: t("signup.required_field"),
                })}
              >
                <option disabled defaultValue={""}>
                  {t("signup.gender")}
                </option>
                <option value="male">{t("signup.male")}</option>
                <option value="female">{t("signup.female")}</option>
              </select>

              <input
                type="email"
                id="email"
                placeholder={t("signup.email")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("email", {
                  required: t("signup.required_field"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("signup.invalid_email"),
                  },
                })}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder={t("signup.password")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("password", {
                  required: t("signup.required_field"),
                  minLength: { value: 6, message: t("signup.password_min") },
                })}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="confirm_password"
                placeholder={t("signup.confirm_password")}
                className={`mt-1 input input-bordered input-ghost h-9 text-sm rounded-md w-full shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("confirm_password", {
                  required: t("signup.required_field"),
                  validate: (value) =>
                    value === watch("password") ||
                    t("signup.password_mismatch"),
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
              {t("login.submit")}
            </button>
          </form>
          <div className="mt-5 space-y-5">
            <NavLink
              to={"#"}
              className="text-sm block underline text-text-600 text-center"
            >
              {t("login.are_you_a_doctor")}
            </NavLink>
            <p className="text-sm text-center">
              {t("login.already_have_an_account")}

              <NavLink to="/SignUp" className="ml-1 underline text-text-600">
                {t("login.login")}
              </NavLink>
            </p>
          </div>
        </div>
      </section>
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
          className="w-[50dvw] p-3 [mask-image:radial-gradient(50dvw_circle_at_center,#ffffffcc_0%,#ffffff99_20%,#ffffff66_40%,#ffffff33_60%,#ffffff11_80%,transparent)] blur-[.5px] ml-[50dvw]"
        />
      </section>
    </div>
  );
}

export default SignUp;
