import { WobbleCard } from "@/Components/WobbleCard/WobbleCard";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon,
  PlusIcon,
  SearchIcon,
  Star,
  User,
  XIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast, Toaster } from "sonner";
import moment from "jalali-moment";
import Counter from "@/Components/Counter/Counter";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useReducer, useState } from "react";
import { useSearchParams } from "react-router";
import { AppContext } from "@/main";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import AdminCard from "./Cards/AdminCard";
import Loader from "@/Components/Loader/Loader";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DatePicker } from "zaman";
import { password } from "bun";
export function Stats() {
  const [t] = useTranslation();
  return (
    <div
      className={`flex flex-row flex-wrap justify-center items-center h-full font-${
        t("language") === "fa" ? "font-fa" : "font-Roboto"
      }`}
    >
      <WobbleCard
        containerClassName="flex justify-center items-center flex-col w-[40%] bg-repeat h-96 bg-background-300 "
        className=" w-full h-full flex justify-center items-center flex-col"
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
        containerClassName="flex justify-center items-center flex-col w-[40%] bg-repeat h-96 bg-background-300 "
        className="bg-repeat w-full h-full flex justify-center items-center flex-col "
      >
        <div className="relative ">
          <div className="w-[7.6rem] h-32 mask mask-star bg-red-400 absolute mb-2 bg-gradient-to-r from-yellow-500  to-text-100 from-[50%] to-[50%] -top-1 left-[.2rem] -z-10"></div>
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
  const [t, i18] = useTranslation();
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
    queryKey: ["Category", window.location.href, page, query],

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
        console.log(url);
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
      console.log(res);
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
                  console.log(age, birth_date, value);
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
              value={
                app.appConfig.language === "fa"
                  ? moment(selected_admin.updated_at)
                      .locale("fa")
                      .add(3, "hours")
                      .add(30, "minutes")
                      .format("YYYY/MM/DD HH:mm")
                      .toString()
                  : new Date(selected_admin.updated_at!).toLocaleString(
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
              }
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
              value={
                app.appConfig.language === "fa"
                  ? moment(selected_admin.created_at)
                      .locale("fa")
                      .add(3, "hours")
                      .add(30, "minutes")
                      .format("YYYY/MM/DD HH:mm")
                  : new Date(selected_admin.created_at!).toLocaleString(
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
              }
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
              onClick={() => HandleSelect(null)}
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
  return <></>;
}
export function Doctors() {
  return <></>;
}

export interface PatientFull {
  id: string; // RecordId is likely to be a string or some identifier
  full_name: string;
  national_code: string;
  phone_number: string;
  birth_date: string; // A string representing a datetime, or you can use Date type
  gender: string;
  email: string;
  password_hash: string;
  wallet_balance: number;
  created_at: string; // A string representing a datetime
  updated_at: string; // A string representing a datetime
}

export interface DoctorFull {
  id: string; // RecordId
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
  created_at: string;
  updated_at: string;
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
