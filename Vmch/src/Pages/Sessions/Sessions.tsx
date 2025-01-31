import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { AppContext } from "@/main";
import Chat from "../Chat/Chat";
import Loader from "@/Components/Loader/Loader";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDown,
  ArrowUpWideNarrowIcon,
  Search,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { WobbleCard } from "@/Components/WobbleCard/WobbleCard";
import { useSearchParams } from "react-router";
import { CategoryQuery } from "../Category/Category";
import { debounce } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "jalali-moment";

interface Session {
  id: string;
  doctor: {
    id: string;
    full_name: string;
    gender: "man" | "woman";
    medical_code: string;
    specialization: string;
    profile_image: string;
  };
  patient: {
    id: string;
    full_name: string;
    gender: "man" | "woman";
  };
  target_full_name?: string;
  target_national_code?: string;
  target_birth_date?: string;
  target_gender?: "man" | "woman";
  target_phone_number?: string;
  messages?: string[];
  status: "new" | "waiting" | "answered" | "ended";
  end_time?: string;
  rating?: number;
  feedback?: string;
  fee_paid: number;
  admin_share: number;
  created_at: string;
  updated_at: string;
}

export default function Sessions() {
  const [page, set_page] = useState(1);
  const [search_params] = useSearchParams();
  const app = useContext(AppContext);
  const [t, i18] = useTranslation();
  const [visable_sessions, set_visable_sessions] = useState(
    (page - 1) * 40 + 40
  );

  const [isFilterChange, setIsFilterChange] = useState(false);
  const [ended, set_ended] = useState(false);
  const [sessions, set_sessions] = useState<Session[]>([]);
  const [query, set_query] = useState<CategoryQuery>({
    gender: search_params.get("gender") || undefined,
    search_bar: search_params.get("search_bar") || undefined,
    order: search_params.get("order") || undefined,
  });

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["sessions", query, page],
    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/sessions`);
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", page.toString());
      const response = await invoke("post", {
        url: url.toString(),
        payload: {
          id: app.appConfig.user?.id,
          role: app.appConfig.user?.role,
        },
      });
      //@ts-ignore
      if (response[0]["id"]) return response as Session[];
      if (JSON.stringify(response) === JSON.stringify("empty")) return [];
      throw new Error("Failed to fetch sessions.");
    },
  });

  useEffect(() => {
    if (isError) {
      console.log("error");
    }
    if (isSuccess) {
      set_sessions((prev) => {
        if (isFilterChange) {
          // Replace the session if it's a filter change
          set_visable_sessions(data.length);
          set_ended(data.length < 40 || data.length === 0);
          return data;
        } else {
          // Append the session if it's a pagination change
          set_visable_sessions(prev.length + data.length);
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
  // Track query or page changes to distinguish filter vs page
  useEffect(() => {
    setIsFilterChange(true);
  }, [query]);

  useEffect(() => {
    setIsFilterChange(false);
  }, [page]);
  return (
    <div
      className={`w-full h-full flex justify-center items-center flex-col text-text-900 ${
        app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
      }`}
    >
      <section id="search_bar" className="flex flex-row mb-4 mt-4 ">
        <button
          className="w-12 mr-5 h-12  btn p-0 btn-secondary"
          onClick={() =>
            set_query({
              ...query,
              order: query.order === "asc" ? "desc" : "asc",
            })
          }
        >
          {query.order === "asc" ? (
            <ArrowUpWideNarrowIcon className="" />
          ) : (
            <ArrowDownWideNarrowIcon className="" />
          )}
        </button>
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
                (value) => set_query({ ...query, search_bar: value }),
                500
              )(e.currentTarget.value)
            }
            onSubmit={(e) =>
              set_query({ ...query, search_bar: e.currentTarget.value })
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
      </section>
      <div id="doctors" className="flex flex-col md:flex-row w-full">
        <InfiniteScroll
          hasMore={!ended}
          loader={<Loader size={40} color={[6, 147, 126]} />}
          dataLength={visable_sessions}
          next={() => set_page(page + 1)}
          className="flex flex-row flex-wrap justify-center items-center w-full"
        >
          {Array.from({ length: visable_sessions }).map((_, idx) => (
            <SessionCard
              key={idx}
              align={app.appConfig.language === "fa" ? "rtl" : "ltr"}
              item={sessions[idx]}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

function SessionCard(props: { item: Session; align: string }) {
  const [t] = useTranslation();
  const app = useContext(AppContext);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "badge-info";
      case "waiting":
        return "badge-warning";
      case "answered":
        return "badge-primary";
      case "ended":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <>
      {props.item ? (
        <WobbleCard
          containerClassName="w-screen  mx-4 my-2 bg-background-300"
          className="p-4 cursor-pointer hover:bg-background-200 transition-colors noiseBackground"
        >
          <div className="flex flex-col gap-3 text-text-900 ">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-14 h-14 ">
                    {app.appConfig.user!.role === "doctor" ||
                    app.appConfig.user!.role === "admin" ? (
                      <img
                        src={"/Images/vmch_color.png"}
                        alt="Avatar"
                        className="bg-background-100 object-cover mask mask-squircle"
                      />
                    ) : (
                      <img
                        src={props.item.doctor.profile_image + "?" + Date.now()}
                        alt="Avatar"
                        className="bg-background-100 object-cover mask mask-squircle"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-900">
                    {app.appConfig.user!.role === "doctor" ||
                    app.appConfig.user!.role === "admin"
                      ? props.item.patient.full_name
                      : props.item.doctor.full_name}
                  </h3>
                  {(app.appConfig.user!.role === "doctor" ||
                    app.appConfig.user!.role === "admin") && (
                    <p className="text-sm opacity-70 font-semibold">
                      {props.item.patient.gender === "man"
                        ? t("male")
                        : t("female")}
                    </p>
                  )}
                  {app.appConfig.user!.role === "patient" && (
                    <p className="text-sm opacity-70 font-semibold">
                      {props.item.doctor.specialization} - {t("medical_code")}:{" "}
                      {props.item.doctor.medical_code}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`badge noiseBackground ${getStatusBadgeClass(
                    props.item.status
                  )}`}
                >
                  {t(`status.${props.item.status}`)}
                </span>
                <span className=" opacity-70">
                  {app.appConfig.language === "fa"
                    ? moment(props.item.created_at || Date.now())
                        .locale("fa")
                        .format("YYYY/MM/DD HH:mm")
                        .toString()
                    : new Date(
                        props.item.created_at || Date.now()
                      ).toLocaleString("en-GB", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                </span>
              </div>
            </div>

            <div className="divider my-1"></div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-4 flex-row w-full justify-between">
                <span>
                  {t("fee")}: ${props.item.fee_paid}
                </span>

                {props.item.rating && (
                  <span className=" w-20 text-clip  overflow-hidden   whitespace-nowrap">
                    {t("rating")}: {props.item.rating || 0.0}/5 ⭐
                  </span>
                )}
              </div>
            </div>
          </div>
        </WobbleCard>
      ) : (
        <WobbleCard
          containerClassName="w-full  mx-4 my-2 bg-background-300 animate-pulse"
          className="p-4 cursor-pointer hover:bg-background-200 transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-skeleton-300"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-skeleton-300 w-40 h-6"></h3>
                  <p className="text-sm opacity-70 bg-skeleton-300 w-40 h-6"></p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="badge bg-skeleton-300 w-24 h-6"></span>
                <span className="text-sm opacity-70 bg-skeleton-300 w-24 h-6"></span>
              </div>
            </div>

            <div className="divider my-1"></div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-4">
                <span className="bg-skeleton-300 w-24 h-6"></span>
                <span className="flex items-center gap-1 bg-skeleton-300 w-24 h-6"></span>
              </div>
              <span className="opacity-70 bg-skeleton-300 w-24 h-6"></span>
            </div>
          </div>
        </WobbleCard>
      )}
    </>
  );
}
