import { Waves } from "@/Components/Waves/Waves";
import { AppContext } from "@/main";
import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Loader from "@/Components/Loader/Loader";
import { Toaster, toast } from "sonner";
import { NavLink, useNavigate } from "react-router";
import { logo } from "@/icons";
import { useTranslation } from "react-i18next";
import { DatePicker } from "zaman";
import { invoke } from "@tauri-apps/api/core";
import { Patient } from "@/lib/utils";
type Inputs = {
  full_name: string;
  national_code: string;
  birth_date: string;
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
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const [disabled, set_disabled] = useState(false);
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors, clicked]);
  const nav = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //buttonSubmit.current!.disabled = true;
    const { confirm_password, password, ...newData } = data;
    let password_hash = await invoke<string>("argon2", {
      password: data.password,
    });

    invoke<Patient | "Conflict" | "Internal server error" | string>("post", {
      url: `${app.appConfig.server}/sign_up`,
      payload: { ...newData, password_hash },
    }).then((res) => {
      if (res === "Conflict") {
        toast.error(t("login.sign_up.conflict"));
        set_disabled(false);
      } else if (res === "Internal server error") {
        toast.error(t("login.sign_up.failed"));
        set_disabled(false);
        //@ts-ignore
      } else if (res["Patient"]) {
        toast.success(t("login.sign_up.success"));
        setTimeout(() => {
          nav("/SignIn");
        }, 2000);
      } else {
        toast.error(t("login.sign_up.connection_error"));
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
        position="top-right"
        visibleToasts={100}
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      />
      <section className="h-screen w-screen md:w-[50dvw] relative overflow-hidden  flex flex-col items-center justify-center pl-5 pr-5 ">
        {logo(45)}
        <p className="mb-4 mt-4 text-xl font-bold tracking-tight">
          {t("login.sign_up.title")}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-96">
          <div className="mb-4 flex flex-row gap-3">
            <input
              type="text"
              id="full_name"
              placeholder={t("login.sign_up.full_name")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-3/4 ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("full_name", {
                required: t("login.sign_up.full_name_is_required"),
                pattern: {
                  value: /^[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s]{1,29}$/,
                  message: t("login.sign_up.invalid_full_name"),
                },
              })}
            />

            {/* National Code */}

            <input
              type="number"
              id="national_code"
              placeholder={t("login.sign_up.national_code")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm ${
                app.appConfig.language === "fa" ? "text-right pr-8" : ""
              }`}
              {...register("national_code", {
                required: t("login.sign_up.national_code_is_required"),
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: t("login.sign_up.invalid_national_code"),
                },
              })}
            />
          </div>
          <div className="mb-4 flex flex-row gap-3">
            <input
              type="tel"
              id="phone_number"
              placeholder={t("login.sign_up.phone_number")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md w-1/2 shadow-sm ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("phone_number", {
                required: t("login.sign_up.phone_number_is_required"),
                pattern: {
                  value: /^[0-9]{10,14}$/,
                  message: t("login.sign_up.invalid_phone_number"),
                },
              })}
            />
            <div className="flex flex-col gap-3 w-1/2 ">
              <Controller
                control={control}
                name="birth_date"
                rules={{
                  validate: (value) => {
                    const today = new Date();
                    let birth_date = new Date(value);
                    let age = today.getFullYear() - birth_date.getFullYear();
                    const m = today.getMonth() - birth_date.getMonth();
                    if (
                      m < 0 ||
                      (m === 0 && today.getDate() < birth_date.getDate())
                    ) {
                      age--;
                    }
                    return (
                      age >= 13 ||
                      t("login.sign_up.age_must_be_at_least_13_years")
                    );
                  },
                }}
                render={({ field: { onChange } }) => (
                  <DatePicker
                    position="right"
                    round="x1"
                    className="font-fa min-h-0 min-w-0 max-h-[70dvh] "
                    locale={app.appConfig.language === "fa" ? "fa" : "en"}
                    accentColor={
                      app.appConfig.theme === "dark" ? "#182927" : "#046254"
                    }
                    onChange={(value) => {
                      onChange(value.value.toISOString());
                    }}
                    inputAttributes={{
                      placeholder: t("login.sign_up.birth_date"),
                    }}
                    inputClass={`input mt-1 font-fa input-bordered  input-ghost w-full  max-h-9 text-sm rounded-md  shadow-sm ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                  />
                )}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="mb-4 flex flex-row gap-4">
            <select
              defaultValue={t("gender.title")}
              id="gender"
              className={`mt-1  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-1/3 ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("gender", {
                validate: (value) =>
                  value === "man" ||
                  value === "woman" ||
                  t("login.sign_up.gender_is_required"),
              })}
            >
              <option disabled>{t("gender.title")}</option>
              <option value="man">{t("gender.man")}</option>
              <option value="woman">{t("gender.woman")}</option>
            </select>

            <input
              type="email"
              id="email"
              placeholder={t("login.sign_up.email")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-2/3 ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("email", {
                required: t("login.sign_up.email_is_required"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("login.sign_up.invalid_email"),
                },
              })}
            />
          </div>

          {/* Password */}
          <div className="mb-4 ">
            <input
              type="password"
              id="password"
              placeholder={t("login.sign_up.password")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("password", {
                required: t("login.sign_up.password_is_required"),
                minLength: {
                  value: 8,
                  message: t(
                    "login.sign_up.password_must_be_at_least_8_characters"
                  ),
                },
                maxLength: {
                  value: 100,
                  message: t(
                    "login.sign_up.password_must_be_at_most_100_characters"
                  ),
                },
              })}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="confirm_password"
              placeholder={t("login.sign_up.confirm_password")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("confirm_password", {
                required: t("login.sign_up.password_is_required"),
                validate: (value) =>
                  value === watch("password") ||
                  t("login.sign_up.password_and_confirm_password_dont_match"),
              })}
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full btn btn-primary"
            disabled={disabled}
            onClick={() => {
              set_clicked((prev) => !prev);
            }}
          >
            {disabled ? (
              <Loader size={40} color={[6, 147, 126]} />
            ) : (
              t("login.sign_up.submit")
            )}
          </button>
        </form>
        <div className="mt-5 space-y-5">
          <NavLink
            to={"#"}
            onClick={() => {
              const modal = document.getElementById(
                "are_you_a_doctor"
              ) as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
            className="text-sm block underline text-text-600 text-center"
          >
            {t("login.sign_up.are_you_a_doctor")}
          </NavLink>
          <p className="text-sm text-center">
            {t("login.sign_up.already_have_an_account")}

            <NavLink to="/SignIn" className="ml-1 underline text-text-600">
              {t("login.sign_up.login")}
            </NavLink>
          </p>
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
      <dialog
        id="are_you_a_doctor"
        className="modal"
        style={{
          direction: app.appConfig.language === "fa" ? "rtl" : "ltr",
        }}
        onClick={(e) => {
          if (e.target === document.getElementById("are_you_a_doctor")) {
            (
              document.getElementById("are_you_a_doctor") as HTMLDialogElement
            ).close();
          }
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">
              {t("login.sign_up.doctor_sign_up")}
            </h3>
            <button
              type="button"
              className="btn btn-sm  btn-ghost"
              onClick={() => {
                (
                  document.getElementById(
                    "are_you_a_doctor"
                  ) as HTMLDialogElement
                ).close();
              }}
            >
              X
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const medical_code = formData.get("medical_code") as string;
              const full_name = formData.get("full_name") as string;
              const phone_number = formData.get("phone_number") as string;
              invoke("post", {
                url: `${app.appConfig.server}/new_doctor`,
                payload: {
                  medical_code,
                  full_name,
                  phone_number,
                },
              }).then((res) => {
                if (JSON.stringify(res) === JSON.stringify("ok")) {
                  toast.success(t("login.sign_up.doctor_sign_up_success"));
                  (
                    document.getElementById(
                      "are_you_a_doctor"
                    ) as HTMLDialogElement
                  ).close();
                } else {
                  toast.error(t("login.sign_up.doctor_sign_up_failed"));
                }
                (e.target as HTMLFormElement).reset();
              });
            }}
          >
            <label className="label">
              <span className="label-text">
                {t("login.sign_up.medical_code")}
              </span>
            </label>
            <input
              type="text"
              name="medical_code"
              placeholder={t("login.sign_up.medical_code")}
              className="mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full "
              required
            />
            <label className="label">
              <span className="label-text">{t("login.sign_up.full_name")}</span>
            </label>
            <input
              type="text"
              name="full_name"
              placeholder={t("login.sign_up.full_name")}
              className="mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full "
              required
            />
            <label className="label">
              <span className="label-text">
                {t("login.sign_up.phone_number")}
              </span>
            </label>
            <input
              type="text"
              placeholder={t("login.sign_up.phone_number")}
              name="phone_number"
              className="mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full "
              required
            />
            <button type="submit" className="btn btn-primary mt-4 w-full">
              {t("login.sign_up.submit")}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default SignUp;
