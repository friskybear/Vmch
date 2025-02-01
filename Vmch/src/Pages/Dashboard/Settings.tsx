import { AppContext } from "@/main";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { AdminFull, DoctorFull, PatientFull } from "./Admin";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DatePicker } from "zaman";
import Loader from "@/Components/Loader/Loader";
import moment from "jalali-moment";
import { Doctor, Patient } from "@/lib/utils";
import CardNumbers from "@/Components/CardNumbers/CardNumbers";

function Settings() {
  const app = useContext(AppContext);
  const role = app.appConfig.user?.role;

  return (
    <div className="h-full w-full ">
      {role === "admin" ? (
        <AdminSettings />
      ) : role === "patient" ? (
        <PatientSettings />
      ) : (
        <DoctorSettings />
      )}
    </div>
  );
}

export default Settings;

function AdminSettings() {
  const app = useContext(AppContext);
  const [selected_admin, set_selected_admin] = useState<AdminFull>({
    id: app.appConfig.user?.id,
    full_name: app.appConfig.user?.fullName || "",
    email: app.appConfig.user?.email || "",
    birth_date:
      app.appConfig.user?.birthDate?.toString() || Date.now().toString(),
    national_code: app.appConfig.user?.nationalCode || "",
    gender: app.appConfig.user?.gender || "",
    password_hash: app.appConfig.user?.password || "",
  });
  const [disabled, set_disabled] = useState(false);
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, control } = useForm<AdminFull>();
  useEffect(() => {
    if (selected_admin !== null) {
      setValue("full_name", selected_admin.full_name);
      setValue("email", selected_admin.email);
      setValue("password_hash", selected_admin.password_hash);
      setValue("national_code", selected_admin.national_code);
      setValue("gender", selected_admin.gender);
      setValue("birth_date", selected_admin.birth_date);
      setValue(
        "created_at",
        app.appConfig.language === "fa"
          ? moment(selected_admin.created_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_admin.created_at || Date.now()).toLocaleString(
              "en-GB",
              {
                timeZone: "UTC",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )
      );
      setValue(
        "updated_at",
        app.appConfig.language === "fa"
          ? moment(selected_admin.updated_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_admin.updated_at || Date.now()).toLocaleString(
              "en-GB",
              {
                timeZone: "UTC",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )
      );
    }
  }, [selected_admin]);
  const onSubmit: SubmitHandler<AdminFull> = async (data) => {
    if (data.id && data.password_hash !== selected_admin!.password_hash) {
      const password_hash = await invoke<string>("argon2", {
        password: data.password_hash,
      });
      const crypto = window.crypto;
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password_hash)
      );
      data.password_hash = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    if (selected_admin?.id) {
      data.id = selected_admin.id.toString();
    }
    invoke<AdminFull | "Conflict" | "Internal server error" | string>("post", {
      url: `${app.appConfig.server}/upsert_admin`,
      payload: data,
    }).then((res) => {
      if (res === "Conflict") {
        toast.error(t("login.sign_up.conflict"));
        set_disabled(false);
      } else if (res === "Internal server error") {
        toast.error(t("login.sign_up.failed"));
        set_disabled(false);
        //@ts-ignore
      } else if (res["id"]) {
        toast.success(t("login.sign_up.success"));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(t("login.sign_up.connection_error"));
        set_disabled(false);
      }
    });
  };
  return (
    <>
      <div
        className={`w-screen h-full flex justify-start items-center flex-col overflow-y-scroll pb-10 text-text-800 ${
          app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
        }`}
      >
        <Toaster
          richColors
          position="top-right"
          visibleToasts={100}
          dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-96">
          <input
            type="text"
            id="full_name"
            placeholder={t("login.sign_up.full_name")}
            className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
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
          {/* Email */}

          <input
            type="email"
            id="email"
            placeholder={t("login.sign_up.email")}
            className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
              app.appConfig.language === "fa" ? "text-right" : ""
            }`}
            {...register("email", {
              required: t("login.sign_up.email_is_required"),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: t("login.sign_up.invalid_email"),
              },
            })}
          />

          {/* National Code */}
          <div className="flex flex-row gap-3">
            <input
              type="number"
              id="national_code"
              placeholder={t("login.sign_up.national_code")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-1/2${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("national_code", {
                required: t("login.sign_up.national_code_is_required"),
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: t("login.sign_up.invalid_national_code"),
                },
              })}
            />
            <select
              value={selected_admin.gender}
              id="gender"
              className={`mt-1  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-1/2 ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("gender", {
                onChange: (e) => {
                  set_selected_admin({
                    ...selected_admin,
                    gender: e.target.value,
                  });
                },
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
          </div>
          {/* Password */}

          <input
            type="text"
            id="password"
            placeholder={t("login.sign_up.password")}
            className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
              app.appConfig.language === "fa" ? "text-right" : ""
            }`}
            {...register("password_hash", {
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

          <Controller
            control={control}
            name="birth_date"
            defaultValue={selected_admin.birth_date}
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
                  age >= 13 || t("login.sign_up.age_must_be_at_least_13_years")
                );
              },
            }}
            render={({ field: { onChange } }) => (
              <DatePicker
                position="right"
                round="x1"
                className="font-fa min-h-0 min-w-0 max-h-[70dvh] z-50"
                defaultValue={selected_admin.birth_date}
                locale={app.appConfig.language === "fa" ? "fa" : "en"}
                accentColor={
                  app.appConfig.theme === "dark" ? "#182927" : "#046254"
                }
                onChange={(value) => {
                  onChange(value.value.toISOString());
                }}
                inputAttributes={{
                  placeholder: t("login.sign_up.birth_date"),
                  value: selected_admin.birth_date,
                }}
                inputClass={`input mt-1 font-fa input-bordered  input-ghost w-full  max-h-9 text-sm rounded-md  shadow-sm ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
              />
            )}
          />

          <button
            type="submit"
            className="mt-4 w-full btn btn-primary"
            disabled={disabled}
          >
            {disabled ? (
              <Loader size={40} color={[6, 147, 126]} />
            ) : (
              t("login.sign_up.submit")
            )}
          </button>
        </form>
      </div>
    </>
  );
}

function DoctorSettings() {
  const app = useContext(AppContext);
  let user = app.appConfig.user as Doctor;
  const [selected_doctor, set_selected_doctor] = useState<DoctorFull>({
    id: user.id,
    national_code: user.nationalCode,
    full_name: user.fullName,
    birth_date: user.birthDate.toString(),
    gender: user.gender,
    email: user.email,
    password_hash: user.password,
    phone_number: user.phoneNumber,
    wallet_balance: user.walletBalance,
    status: user.status,
    availability: user.availability,
    created_at: "",
    updated_at: "",
    profile_image: user.profileImage,
    specialization: user.specialization,
    admin_commission_percentage: user.adminCommissionPercentage,
    medical_code: user.medicalCode,
    card_number: user.cardNumber,
    consultation_fee: user.consultationFee,
  });
  const [disabled, set_disabled] = useState(false);
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, control } = useForm<DoctorFull>();
  useEffect(() => {
    if (selected_doctor !== null) {
      setValue("full_name", selected_doctor.full_name);
      setValue("email", selected_doctor.email);
      setValue("password_hash", selected_doctor.password_hash);
      setValue("national_code", selected_doctor.national_code);
      setValue("gender", selected_doctor.gender);
      setValue("birth_date", selected_doctor.birth_date);
      setValue("wallet_balance", selected_doctor.wallet_balance);
      setValue("phone_number", selected_doctor.phone_number);
      setValue("medical_code", selected_doctor.medical_code);
      setValue("specialization", selected_doctor.specialization);
      setValue("category", selected_doctor.category);
      setValue("profile_image", selected_doctor.profile_image);
      setValue("consultation_fee", selected_doctor.consultation_fee);
      setValue(
        "admin_commission_percentage",
        selected_doctor.admin_commission_percentage
      );
      setValue("status", selected_doctor.status);
      setValue("availability", selected_doctor.availability);
      setValue("card_number", selected_doctor.card_number);
    }
  }, [selected_doctor]);
  const onSubmit: SubmitHandler<DoctorFull> = async (data) => {
    if (data.id && data.password_hash !== selected_doctor!.password_hash) {
      const password_hash = await invoke<string>("argon2", {
        password: data.password_hash,
      });
      const crypto = window.crypto;
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password_hash)
      );
      data.password_hash = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    if (selected_doctor?.id) {
      data.id = selected_doctor.id.toString();
    }
    invoke<DoctorFull | "Conflict" | "Internal server error" | string>("post", {
      url: `${app.appConfig.server}/upsert_doctor`,
      payload: data,
    }).then((res) => {
      if (res === "Conflict") {
        toast.error(t("login.sign_up.conflict"));
        set_disabled(false);
      } else if (res === "Internal server error") {
        toast.error(t("login.sign_up.failed"));
        set_disabled(false);
        //@ts-ignore
      } else if (res["id"]) {
        toast.success(t("login.sign_up.success"));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(t("login.sign_up.connection_error"));
        set_disabled(false);
      }
    });
  };

  return (
    <>
      <div
        className={`w-screen h-full flex justify-start items-center flex-col overflow-y-scroll pb-10 text-text-800 ${
          app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
        }`}
      >
        <Toaster
          richColors
          position="top-right"
          visibleToasts={100}
          dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex justify-center items-center flex-col"
        >
          <div className="flex flex-row gap-3 flex-wrap items-start justify-center">
            <div className="max-w-96">
              <input
                type="text"
                id="full_name"
                placeholder={t("login.sign_up.full_name")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("full_name", {
                  required: t("login.sign_up.full_name_is_required"),
                  pattern: {
                    value:
                      /^[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s]{1,29}$/,
                    message: t("login.sign_up.invalid_full_name"),
                  },
                })}
              />
              {/* Email */}

              <input
                type="email"
                id="email"
                placeholder={t("login.sign_up.email")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("email", {
                  required: t("login.sign_up.email_is_required"),
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: t("login.sign_up.invalid_email"),
                  },
                })}
              />

              {/* National Code */}
              <div className="flex flex-row gap-3">
                <input
                  type="number"
                  id="national_code"
                  placeholder={t("login.sign_up.national_code")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-1/2${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("national_code", {
                    required: t("login.sign_up.national_code_is_required"),
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: t("login.sign_up.invalid_national_code"),
                    },
                  })}
                />
                <select
                  value={selected_doctor.gender}
                  id="gender"
                  className={`mt-1  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-1/2 ${
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
              </div>
              {/* Password */}

              <input
                type="text"
                id="password"
                placeholder={t("login.sign_up.password")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("password_hash", {
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

              <Controller
                control={control}
                name="birth_date"
                defaultValue={selected_doctor.birth_date}
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
                    className="font-fa min-h-0 min-w-0 max-h-[70dvh] z-50"
                    defaultValue={selected_doctor.birth_date}
                    locale={app.appConfig.language === "fa" ? "fa" : "en"}
                    accentColor={
                      app.appConfig.theme === "dark" ? "#182927" : "#046254"
                    }
                    onChange={(value) => {
                      onChange(value.value.toISOString());
                    }}
                    inputAttributes={{
                      placeholder: t("login.sign_up.birth_date"),
                      value: selected_doctor.birth_date,
                    }}
                    inputClass={`input mt-1 font-fa input-bordered  input-ghost w-full  max-h-9 text-sm rounded-md  shadow-sm ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                  />
                )}
              />
              {/* Medical Code */}
              <input
                type="text"
                id="medical_code"
                placeholder={t("login.sign_up.medical_code")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("medical_code", {
                  required: t("login.sign_up.medical_code_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      medical_code: event.target.value,
                    }),
                })}
              />

              {/* Specialization */}
              <input
                type="text"
                id="specialization"
                placeholder={t("login.sign_up.specialization")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("specialization", {
                  required: t("login.sign_up.specialization_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      specialization: event.target.value,
                    }),
                })}
              />
            </div>
            <div className="max-w-96">
              {/* Profile Image */}
              <input
                type="text"
                id="profile_image"
                placeholder={t("login.sign_up.profile_image")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full  ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("profile_image", {
                  required: t("login.sign_up.profile_image_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      profile_image: event.target.value,
                    }),
                })}
              />

              {/* Consultation Fee */}
              <input
                type="number"
                id="consultation_fee"
                placeholder={t("login.sign_up.consultation_fee")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right pr-8" : ""
                }`}
                {...register("consultation_fee", {
                  required: t("login.sign_up.consultation_fee_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      consultation_fee: parseInt(event.target.value, 10) || 0,
                    }),
                })}
              />

              {/* Admin Commission Percentage */}
              <input
                type="number"
                id="admin_commission_percentage"
                placeholder={t("login.sign_up.admin_commission_percentage")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right pr-8" : ""
                }`}
                {...register("admin_commission_percentage", {
                  required: t(
                    "login.sign_up.admin_commission_percentage_is_required"
                  ),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      admin_commission_percentage:
                        parseInt(event.target.value, 10) || 0,
                    }),
                })}
              />

              {/* Wallet Balance */}
              <input
                type="number"
                id="wallet_balance"
                placeholder={t("login.sign_up.wallet_balance")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right pr-8" : ""
                }`}
                {...register("wallet_balance", {
                  required: t("login.sign_up.wallet_balance_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      wallet_balance: parseInt(event.target.value, 10) || 0,
                    }),
                })}
              />

              {/* Status */}
              <select
                id="status"
                className={`mt-1 select select-bordered select-ghost  max-h-9 min-h-0 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right " : ""
                }`}
                {...register("status", {
                  required: t("login.sign_up.status_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      status: event.target.value,
                    }),
                })}
              >
                <option value="active">
                  {t("login.sign_up.status.active")}
                </option>
                <option value="disabled">
                  {t("login.sign_up.status.disabled")}
                </option>
              </select>

              {/* Availability */}
              <input
                type="number"
                id="availability"
                placeholder={t("login.sign_up.availability")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right pr-8" : ""
                }`}
                {...register("availability", {
                  required: t("login.sign_up.availability_is_required"),
                  onChange: (event) =>
                    set_selected_doctor({
                      ...selected_doctor,
                      availability: parseInt(event.target.value, 10) || 0,
                    }),
                })}
              />
            </div>
            <div className="max-w-96">
              {/* Card Number */}
              <Controller
                control={control}
                name="card_number"
                defaultValue={selected_doctor.card_number}
                rules={{
                  validate: (value) => {
                    return (
                      value.length >= 1 ||
                      t("login.sign_up.card_number_is_required")
                    );
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <CardNumbers defaultValue={value} onChange={onChange} />
                )}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full btn btn-primary max-w-96"
            disabled={disabled}
          >
            {disabled ? (
              <Loader size={40} color={[6, 147, 126]} />
            ) : (
              t("login.sign_up.submit")
            )}
          </button>
        </form>
      </div>
    </>
  );
}

function PatientSettings() {
  const app = useContext(AppContext);
  const user = app.appConfig.user as Patient;
  const [selected_patient, set_selected_patient] = useState<PatientFull>({
    id: user?.id,
    full_name: user?.fullName || "",
    national_code: user?.nationalCode || "",
    phone_number: user?.PhoneNumber || "",
    gender: user?.gender || "",
    created_at: "",
    updated_at: "",
    wallet_balance: user.walletBalance,
    email: user?.email || "",
    birth_date: user?.birthDate?.toString() || Date.now().toString(),
    password_hash: user?.password || "",
  });
  const [disabled, set_disabled] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
  } = useForm<PatientFull>();
  useEffect(() => {
    if (selected_patient !== null) {
      setValue("full_name", selected_patient.full_name);
      setValue("email", selected_patient.email);
      setValue("password_hash", selected_patient.password_hash);
      setValue("national_code", selected_patient.national_code);
      setValue("gender", selected_patient.gender);
      setValue("phone_number", selected_patient.phone_number);
      setValue("wallet_balance", selected_patient.wallet_balance);
      setValue("birth_date", selected_patient.birth_date);
    }
  }, [selected_patient]);
  const onSubmit: SubmitHandler<PatientFull> = async (data) => {
    if (data.id && data.password_hash !== selected_patient!.password_hash) {
      const password_hash = await invoke<string>("argon2", {
        password: data.password_hash,
      });
      const crypto = window.crypto;
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password_hash)
      );
      data.password_hash = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    if (selected_patient?.id) {
      data.id = selected_patient.id.toString();
    }
    invoke<PatientFull | "Conflict" | "Internal server error" | string>(
      "post",
      {
        url: `${app.appConfig.server}/upsert_user`,
        payload: data,
      }
    ).then((res) => {
      if (res === "Conflict") {
        toast.error(t("login.sign_up.conflict"));
        set_disabled(false);
      } else if (res === "Internal server error") {
        toast.error(t("login.sign_up.failed"));
        set_disabled(false);
        //@ts-ignore
      } else if (res["id"]) {
        toast.success(t("login.sign_up.success"));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(t("login.sign_up.connection_error"));
        set_disabled(false);
      }
    });
  };
  return (
    <>
      <div
        className={`w-screen h-full flex justify-start items-center flex-col overflow-y-scroll pb-10 text-text-800 ${
          app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[600px] "
        >
          <div className="flex flex-row gap-3">
            <div>
              <input
                type="text"
                id="full_name"
                placeholder={t("login.sign_up.full_name")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("full_name", {
                  required: t("login.sign_up.full_name_is_required"),
                  onChange: (e) => {
                    set_selected_patient({
                      ...selected_patient,
                      full_name: e.target.value,
                    });
                  },
                  pattern: {
                    value:
                      /^[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s]{1,29}$/,
                    message: t("login.sign_up.invalid_full_name"),
                  },
                })}
              />
              {/* Email */}

              <input
                type="email"
                id="email"
                placeholder={t("login.sign_up.email")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("email", {
                  required: t("login.sign_up.email_is_required"),
                  onChange: (e) => {
                    set_selected_patient({
                      ...selected_patient,
                      email: e.target.value,
                    });
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: t("login.sign_up.invalid_email"),
                  },
                })}
              />

              {/* National Code */}
              <div className="flex flex-row gap-3">
                <input
                  type="number"
                  id="national_code"
                  placeholder={t("login.sign_up.national_code")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-1/2${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("national_code", {
                    required: t("login.sign_up.national_code_is_required"),
                    onChange: (e) => {
                      set_selected_patient({
                        ...selected_patient,
                        national_code: e.target.value,
                      });
                    },
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: t("login.sign_up.invalid_national_code"),
                    },
                  })}
                />
                <select
                  value={selected_patient.gender}
                  id="gender"
                  className={`mt-1  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-1/2 ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("gender", {
                    onChange: (e) => {
                      set_selected_patient({
                        ...selected_patient,
                        gender: e.target.value,
                      });
                    },
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
              </div>
              {/* Password */}

              <input
                type="text"
                id="password"
                placeholder={t("login.sign_up.password")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("password_hash", {
                  required: t("login.sign_up.password_is_required"),
                  onChange: (e) => {
                    set_selected_patient({
                      ...selected_patient,
                      password_hash: e.target.value,
                    });
                  },
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

              <Controller
                control={control}
                name="birth_date"
                defaultValue={selected_patient.birth_date}
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
                    className="font-fa min-h-0 min-w-0 max-h-[70dvh] z-50"
                    defaultValue={selected_patient.birth_date}
                    locale={app.appConfig.language === "fa" ? "fa" : "en"}
                    accentColor={
                      app.appConfig.theme === "dark" ? "#182927" : "#046254"
                    }
                    onChange={(value) => {
                      onChange(value.value.toISOString());
                      set_selected_patient({
                        ...selected_patient,
                        birth_date: value.value.toISOString(),
                      });
                    }}
                    inputAttributes={{
                      placeholder: t("login.sign_up.birth_date"),
                      value: selected_patient.birth_date,
                    }}
                    inputClass={`input mt-1 font-fa input-bordered  input-ghost w-full  max-h-9 text-sm rounded-md  shadow-sm ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-3 w-1/2">
              {/* Phone Number */}
              <input
                type="tel"
                id="phone_number"
                placeholder={t("login.sign_up.phone_number")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right" : ""
                }`}
                {...register("phone_number", {
                  required: t("login.sign_up.phone_number_is_required"),
                  onChange: (e) => {
                    set_selected_patient({
                      ...selected_patient,
                      phone_number: e.target.value,
                    });
                  },
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: t("login.sign_up.invalid_phone_number"),
                  },
                })}
              />
              {/* Wallet Balance */}
              <input
                type="number"
                id="wallet_balance"
                placeholder={t("login.sign_up.wallet_balance")}
                className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                  app.appConfig.language === "fa" ? "text-right pr-8" : ""
                }`}
                {...register("wallet_balance", {
                  required: t("login.sign_up.wallet_balance_is_required"),
                  onChange: (e) => {
                    set_selected_patient({
                      ...selected_patient,
                      wallet_balance: parseInt(e.target.value),
                    });
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: t("login.sign_up.invalid_wallet_balance"),
                  },
                })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full btn btn-primary"
            disabled={disabled}
          >
            {disabled ? (
              <Loader size={40} color={[6, 147, 126]} />
            ) : (
              t("login.sign_up.submit")
            )}
          </button>
        </form>
      </div>
    </>
  );
}
