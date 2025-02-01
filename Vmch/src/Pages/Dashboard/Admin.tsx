import { WobbleCard } from "@/Components/WobbleCard/WobbleCard";
import { PlusIcon, SearchIcon, Star, User, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast, Toaster } from "sonner";
import moment from "jalali-moment";
import Counter from "@/Components/Counter/Counter";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AppContext } from "@/main";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import AdminCard from "./Cards/AdminCard";
import Loader from "@/Components/Loader/Loader";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DatePicker } from "zaman";
import CardNumbers from "@/Components/CardNumbers/CardNumbers";
import PatientCard from "./Cards/PatientCard";
import DoctorCard from "./Cards/DoctorCard";
export function Stats() {
  const [t] = useTranslation();
  return (
    <div
      className={`flex flex-col gap-5 md:flex-row flex-wrap justify-center items-center h-full font-${
        t("language") === "fa" ? "font-fa" : "font-Roboto"
      }`}
    >
      <WobbleCard
        containerClassName="flex justify-center items-center flex-col w-[40%] min-w-60 bg-repeat h-96 bg-background-300 "
        className=" w-full h-full flex justify-center items-center flex-col noiseBackground"
      >
        <User className="min-w-32 min-h-32 mb-10 fill-transparent dark:text-text-800 text-zinc-700 " />
        <h1 className="text-6xl font-bold font-fancy-en mb-7">
          <Counter value={4839} />
        </h1>
        <p className="text-2xl font-bold  text-center text-pretty text-text-800">
          {t("site.dashboard.online_users")}
        </p>
      </WobbleCard>
      <WobbleCard
        containerClassName="flex justify-center items-center flex-col w-[40%] min-w-60 bg-repeat h-96 bg-background-300 "
        className="bg-repeat w-full h-full flex justify-center items-center flex-col noiseBackground"
      >
        <div className="relative ">
          <div className="w-[7.6rem] h-32 mask mask-star bg-red-400 absolute mb-2 bg-gradient-to-r from-yellow-500  to-text-100 from-[50%] to-[51%] -top-1 left-[.2rem] -z-10"></div>
          <Star className="min-w-32 min-h-32 mb-10 fill-transparent dark:text-text-800 text-zinc-700 " />
        </div>
        <h1 className="text-6xl font-bold font-fancy-en">
          <Counter value={2.5} decimalPlaces={1} className="tracking-tighter" />
        </h1>
        <p className="text-2xl font-bold mt-5 text-center text-text-800">
          {t("site.dashboard.rating_description")}
        </p>
      </WobbleCard>
    </div>
  );
}

interface CategoryQuery {
  search_bar?: string;
}
export function Admins() {
  const [page, set_page] = useState(1);
  const [search_params] = useSearchParams();
  const app = useContext(AppContext);
  const [t] = useTranslation();
  const [visable_admin, set_visable_admin] = useState((page - 1) * 40 + 40);
  const [ended, set_ended] = useState(false);
  const [admins, set_admins] = useState<AdminFull[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AdminFull>();
  const [query, set_query] = useState<CategoryQuery>({
    search_bar: search_params.get("search_bar") || undefined,
  });

  const [selected_admin, set_selected_admin] = useState<AdminFull | null>(null);

  const HandleSelect = (admin: AdminFull | null) => {
    set_selected_admin(admin);
  };
  const [disabled, set_disabled] = useState(false);
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
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["search_admins", page, query],
    retry: true,
    retryDelay: 3000,

    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/search/admins`);
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", page.toString());
      try {
        let admins = await invoke<AdminFull[]>("fetch", {
          url: url.toString(),
        });
        return admins;
      } catch (e) {
        return { error: "Failed to parse doctors" };
      }
    },
  });
  const [isFilterChange, setIsFilterChange] = useState(false);

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

  useEffect(() => {
    if (isError) {
      console.log("error");
    }
    if (isSuccess && data instanceof Array) {
      set_admins((prev) => {
        if (isFilterChange) {
          // Replace the doctors if it's a filter change
          set_visable_admin(data.length);
          set_ended(data.length < 40 || data.length === 0);
          return data;
        } else {
          // Append the doctors if it's a pagination change
          set_visable_admin(prev.length + data.length);
          if (data.length < 40 || data.length === 0) {
            set_ended(true);
          }
          return [...prev, ...data];
        }
      });
      // Reset filter change flag after processing
      setIsFilterChange(false);
    }
  }, [data, isError, isSuccess]);
  useEffect(() => {
    setIsFilterChange(true);
  }, [query]);

  useEffect(() => {
    setIsFilterChange(false);
  }, [page]);

  return (
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
      {selected_admin === null ? (
        <>
          <section id="search_bar" className="flex flex-row  mb-8 ">
            <div className="relative">
              <SearchIcon
                className={`absolute top-[22px] ${
                  app.appConfig.language === "en" ? "left-3" : "right-3"
                } -translate-y-1/2 w-5 h-5`}
                color={
                  app.appConfig.theme === "dark"
                    ? "rgb(200, 200, 200)"
                    : "rgb(0, 0, 0)"
                }
              />
              <input
                type="text"
                className={`input input-primary input-bordered w-[50dvw]  ${
                  app.appConfig.language === "fa"
                    ? "text-right pr-10"
                    : "text-left pl-10"
                }`}
                placeholder={t("search")}
                onChange={(e) =>
                  debounce(
                    (value) => set_query({ search_bar: value }),
                    500
                  )(e.currentTarget.value)
                }
                onSubmit={(e) =>
                  set_query({ search_bar: e.currentTarget.value })
                }
              />
              {query.search_bar !== "" && query.search_bar && (
                <XIcon
                  className={`absolute top-1/2 ${
                    app.appConfig.language === "fa" ? "left-3" : "right-3"
                  } -translate-y-1/2 w-5 h-5 cursor-pointer`}
                  color={
                    app.appConfig.theme === "dark"
                      ? "rgb(200, 200, 200)"
                      : "rgb(0, 0, 0)"
                  }
                  onClick={() => set_query({ ...query, search_bar: "" })}
                />
              )}
            </div>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => HandleSelect({} as AdminFull)}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </section>
          <div id="doctors" className="flex flex-col md:flex-row">
            <InfiniteScroll
              hasMore={!ended}
              loader={<div>Loding...</div>}
              dataLength={visable_admin}
              next={() => set_page(page + 1)}
              className="flex flex-row flex-wrap justify-center items-center"
            >
              {Array.from({ length: visable_admin }).map((_, idx) => (
                <AdminCard
                  key={idx}
                  align={app.appConfig.language === "fa" ? "right" : "left"}
                  item={admins[idx]}
                  set_selected_admin={HandleSelect}
                />
              ))}
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
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

            {/* Created At */}
            <input
              type="text"
              id="updated_at"
              placeholder={t("login.sign_up.updated_at")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("updated_at")}
              disabled
            />

            {/* created At */}
            <input
              type="text"
              id="created_at"
              placeholder={t("login.sign_up.created_at")}
              className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                app.appConfig.language === "fa" ? "text-right" : ""
              }`}
              {...register("created_at")}
              disabled
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
            <button
              type="reset"
              className="mt-4 w-full btn btn-neutral"
              onClick={() => {
                HandleSelect(null);
              }}
            >
              {t("site.cancel")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export function Patients() {
  const [page, set_page] = useState(1);
  const [search_params] = useSearchParams();
  const app = useContext(AppContext);
  const [t] = useTranslation();
  const [visable_patient, set_visable_patient] = useState((page - 1) * 40 + 40);
  const [ended, set_ended] = useState(false);
  const [patient, set_patients] = useState<PatientFull[]>([]);
  const [selected_patient, set_selected_patient] = useState<PatientFull | null>(
    null
  );
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PatientFull>();
  const [query, set_query] = useState<CategoryQuery>({
    search_bar: search_params.get("search_bar") || undefined,
  });

  const HandleSelect = (patient: PatientFull | null) => {
    set_selected_patient(patient);
  };
  const [disabled, set_disabled] = useState(false);
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
      setValue(
        "created_at",
        app.appConfig.language === "fa"
          ? moment(selected_patient.created_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_patient.created_at || Date.now()).toLocaleString(
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
          ? moment(selected_patient.updated_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_patient.updated_at || Date.now()).toLocaleString(
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
  }, [selected_patient]);
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["search_Patient", page, query],
    retry: true,
    retryDelay: 3000,
    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/search/users`);
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", page.toString());
      try {
        let patients = await invoke<PatientFull[]>("fetch", {
          url: url.toString(),
        });
        return patients;
      } catch (e) {
        return { error: "Failed to parse doctors" };
      }
    },
  });
  const [isFilterChange, setIsFilterChange] = useState(false);

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

  useEffect(() => {
    if (isError) {
    }
    if (isSuccess && data instanceof Array) {
      set_patients((prev) => {
        if (isFilterChange) {
          // Replace the doctors if it's a filter change
          set_visable_patient(data.length);
          set_ended(data.length < 40 || data.length === 0);
          return data;
        } else {
          // Append the doctors if it's a pagination change
          set_visable_patient(prev.length + data.length);
          if (data.length < 40 || data.length === 0) {
            set_ended(true);
          }
          return [...prev, ...data];
        }
      });
      // Reset filter change flag after processing
      setIsFilterChange(false);
    }
  }, [data, isError, isSuccess]);
  useEffect(() => {
    setIsFilterChange(true);
  }, [query]);

  useEffect(() => {
    setIsFilterChange(false);
  }, [page]);

  return (
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
      {selected_patient === null ? (
        <>
          <section id="search_bar" className="flex flex-row  mb-8 ">
            <div className="relative">
              <SearchIcon
                className={`absolute top-[22px] ${
                  app.appConfig.language === "en" ? "left-3" : "right-3"
                } -translate-y-1/2 w-5 h-5`}
                color={
                  app.appConfig.theme === "dark"
                    ? "rgb(200, 200, 200)"
                    : "rgb(0, 0, 0)"
                }
              />
              <input
                type="text"
                className={`input input-primary input-bordered w-[50dvw]  ${
                  app.appConfig.language === "fa"
                    ? "text-right pr-10"
                    : "text-left pl-10"
                }`}
                placeholder={t("search")}
                onChange={(e) =>
                  debounce(
                    (value) => set_query({ search_bar: value }),
                    500
                  )(e.currentTarget.value)
                }
                onSubmit={(e) =>
                  set_query({ search_bar: e.currentTarget.value })
                }
              />
              {query.search_bar !== "" && query.search_bar && (
                <XIcon
                  className={`absolute top-1/2 ${
                    app.appConfig.language === "fa" ? "left-3" : "right-3"
                  } -translate-y-1/2 w-5 h-5 cursor-pointer`}
                  color={
                    app.appConfig.theme === "dark"
                      ? "rgb(200, 200, 200)"
                      : "rgb(0, 0, 0)"
                  }
                  onClick={() => set_query({ ...query, search_bar: "" })}
                />
              )}
            </div>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => HandleSelect({} as PatientFull)}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </section>
          <div id="doctors" className="flex flex-col md:flex-row">
            <InfiniteScroll
              hasMore={!ended}
              loader={<div>Loding...</div>}
              dataLength={visable_patient}
              next={() => set_page(page + 1)}
              className="flex flex-row flex-wrap justify-center items-center"
            >
              {Array.from({ length: visable_patient }).map((_, idx) => (
                <PatientCard
                  key={idx}
                  align={app.appConfig.language === "fa" ? "right" : "left"}
                  item={patient[idx]}
                  set_selected_patient={HandleSelect}
                />
              ))}
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
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
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

                <input
                  type="text"
                  id="updated_at"
                  placeholder={t("login.sign_up.updated_at")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("updated_at")}
                  disabled
                />

                {/* created At */}
                <input
                  type="text"
                  id="created_at"
                  placeholder={t("login.sign_up.created_at")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("created_at")}
                  disabled
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
            <button
              type="reset"
              className="mt-4 w-full btn btn-neutral"
              onClick={() => {
                HandleSelect(null);
              }}
            >
              {t("site.cancel")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

interface categoryStructured {
  id: string;
  title: string;
  name: string;
}
export function Doctors() {
  const [page, set_page] = useState(1);
  const [search_params] = useSearchParams();
  const app = useContext(AppContext);
  const [t] = useTranslation();
  const [visable_doctor, set_visable_doctor] = useState((page - 1) * 40 + 40);
  const [ended, set_ended] = useState(false);
  const [doctors, set_doctors] = useState<DoctorFull[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DoctorFull>();
  const [query, set_query] = useState<CategoryQuery>({
    search_bar: search_params.get("search_bar") || undefined,
  });

  const [selected_doctor, set_selected_doctor] = useState<DoctorFull | null>(
    null
  );

  const HandleSelect = (doctor: DoctorFull | null) => {
    set_selected_doctor(doctor);
  };
  const [disabled, set_disabled] = useState(false);
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
      setValue(
        "created_at",
        app.appConfig.language === "fa"
          ? moment(selected_doctor.created_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_doctor.created_at || Date.now()).toLocaleString(
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
          ? moment(selected_doctor.updated_at || Date.now())
              .locale("fa")
              .format("YYYY/MM/DD HH:mm")
              .toString()
          : new Date(selected_doctor.updated_at || Date.now()).toLocaleString(
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
  }, [selected_doctor]);
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    retry: true,
    retryDelay: 3000,
    queryFn: async () => {
      const result = await invoke<categoryStructured[]>("fetch", {
        url: `${app.appConfig.server}/categories/structured`,
      });
      return result;
    },
  });

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["search_doctors", page, query],
    retry: true,
    retryDelay: 3000,
    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/search/doctors`);
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", page.toString());
      try {
        let doctor = await invoke<DoctorFull[]>("fetch", {
          url: url.toString(),
        });
        return doctor;
      } catch (e) {
        return { error: "Failed to parse doctors" };
      }
    },
  });
  const [isFilterChange, setIsFilterChange] = useState(false);

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

  useEffect(() => {
    if (isError) {
      console.log("error");
    }
    if (isSuccess && data instanceof Array) {
      set_doctors((prev) => {
        if (isFilterChange) {
          // Replace the doctors if it's a filter change
          set_visable_doctor(data.length);
          set_ended(data.length < 40 || data.length === 0);
          return data;
        } else {
          // Append the doctors if it's a pagination change
          set_visable_doctor(prev.length + data.length);
          if (data.length < 40 || data.length === 0) {
            set_ended(true);
          }
          return [...prev, ...data];
        }
      });
      // Reset filter change flag after processing
      setIsFilterChange(false);
    }
  }, [data, isError, isSuccess]);
  useEffect(() => {
    setIsFilterChange(true);
  }, [query]);

  useEffect(() => {
    setIsFilterChange(false);
  }, [page]);

  return (
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
      {selected_doctor === null ? (
        <>
          <section id="search_bar" className="flex flex-row  mb-8 ">
            <div className="relative">
              <SearchIcon
                className={`absolute top-[22px] ${
                  app.appConfig.language === "en" ? "left-3" : "right-3"
                } -translate-y-1/2 w-5 h-5`}
                color={
                  app.appConfig.theme === "dark"
                    ? "rgb(200, 200, 200)"
                    : "rgb(0, 0, 0)"
                }
              />
              <input
                type="text"
                className={`input input-primary input-bordered w-[50dvw]  ${
                  app.appConfig.language === "fa"
                    ? "text-right pr-10"
                    : "text-left pl-10"
                }`}
                placeholder={t("search")}
                onChange={(e) =>
                  debounce(
                    (value) => set_query({ search_bar: value }),
                    500
                  )(e.currentTarget.value)
                }
                onSubmit={(e) =>
                  set_query({ search_bar: e.currentTarget.value })
                }
              />
              {query.search_bar !== "" && query.search_bar && (
                <XIcon
                  className={`absolute top-1/2 ${
                    app.appConfig.language === "fa" ? "left-3" : "right-3"
                  } -translate-y-1/2 w-5 h-5 cursor-pointer`}
                  color={
                    app.appConfig.theme === "dark"
                      ? "rgb(200, 200, 200)"
                      : "rgb(0, 0, 0)"
                  }
                  onClick={() => set_query({ ...query, search_bar: "" })}
                />
              )}
            </div>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => HandleSelect({} as DoctorFull)}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </section>
          <div id="doctors" className="flex flex-col md:flex-row">
            <InfiniteScroll
              hasMore={!ended}
              loader={<div>Loding...</div>}
              dataLength={visable_doctor}
              next={() => set_page(page + 1)}
              className="flex flex-row flex-wrap justify-center items-center"
            >
              {Array.from({ length: visable_doctor }).map((_, idx) => (
                <DoctorCard
                  key={idx}
                  align={app.appConfig.language === "fa" ? "right" : "left"}
                  item={doctors[idx]}
                  set_selected_doctor={HandleSelect}
                />
              ))}
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
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
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                {/* Category */}
                <select
                  id="category"
                  className={` select select-bordered select-ghost  max-h-9 text-sm min-h-0   rounded-md  shadow-sm  w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("category", {
                    required: t("login.sign_up.category_is_required"),
                    onChange: (event) =>
                      set_selected_doctor({
                        ...selected_doctor,
                        category: event.target.value,
                      }),
                  })}
                >
                  {categories!.map((category) => (
                    <option key={category.id} value={category.id}>
                      {app.appConfig.language === "fa"
                        ? category.name
                        : category.title}
                    </option>
                  ))}
                </select>

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

                {/* Created At */}
                <input
                  type="text"
                  id="updated_at"
                  placeholder={t("login.sign_up.updated_at")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("updated_at")}
                  disabled
                />

                {/* created At */}
                <input
                  type="text"
                  id="created_at"
                  placeholder={t("login.sign_up.created_at")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm  w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("created_at")}
                  disabled
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
            <button
              type="reset"
              className="mt-4 w-full btn btn-neutral max-w-96"
              onClick={() => {
                HandleSelect(null);
              }}
            >
              {t("site.cancel")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export interface PatientFull {
  id?: string; // RecordId is likely to be a string or some identifier
  full_name: string;
  national_code: string;
  phone_number: string;
  birth_date: string; // A string representing a datetime, or you can use Date type
  gender: string;
  email: string;
  password_hash: string;
  wallet_balance: number;
  created_at?: string; // A string representing a datetime
  updated_at?: string; // A string representing a datetime
}

export interface DoctorFull {
  id?: string; // RecordId
  full_name: string;
  medical_code: string;
  national_code: string;
  phone_number: string;
  email: string;
  password_hash: string;
  birth_date: string;
  gender: string;
  specialization: string;
  category?: string; // Optional RecordId or could be a null value
  profile_image: string;
  consultation_fee: number;
  admin_commission_percentage: number;
  wallet_balance: number;
  status: string;
  availability: number; // This could be a boolean or an integer representing availability hours
  card_number: string[]; // Array of strings representing card numbers
  created_at?: string;
  updated_at?: string;
}

export interface AdminFull {
  id?: string; // RecordId
  full_name: string;
  email: string;
  birth_date: string;
  national_code: string;
  gender: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}
