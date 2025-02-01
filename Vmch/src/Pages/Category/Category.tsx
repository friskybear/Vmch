import { AppContext } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon,
  FilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Loader from "@/Components/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import {  useParams, useSearchParams } from "react-router";
import DocCard from "@/Components/DocCard/DocCard";
interface Doctors {
  full_name: string;
  specialization: string;
  profile_image: string;
  consultation_fee: number;
  availability: number;
  medical_code: string;
  status: string;
  rate?: number;
}
export interface CategoryQuery {
  search_bar?: string;
  order?: string;
  gender?: string;
}
function Category() {
  const [page, set_page] = useState(1);
  const [search_params] = useSearchParams();
  const app = useContext(AppContext);
  const { title } = useParams();
  const [t, i18] = useTranslation();
  const [visable_doctor, set_visable_doctor] = useState((page - 1) * 40 + 40);
  const [ended, set_ended] = useState(false);
  const [doctors, set_doctors] = useState<Doctors[]>([]);
  const [query, set_query] = useState<CategoryQuery>({
    gender: search_params.get("gender") || undefined,
    search_bar: search_params.get("search_bar") || undefined,
    order: search_params.get("order") || undefined,
  });
  const [category, set_category] = useState<string[]>([]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["Category", window.location.href, page, query],

    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/search/category/${title}`);
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", page.toString());
      let doctors = await invoke<Doctors[]>("fetch", { url: url.toString() });
      try {
        if (
          doctors.every(
            (d) =>
              "full_name" in d &&
              "specialization" in d &&
              "profile_image" in d &&
              "consultation_fee" in d &&
              "availability" in d &&
              "status" in d &&
              "medical_code" in d
          )
        ) {
          const json = invoke<string>("fetch", {
            url: `${app.appConfig.server}/categories`,
          }).then((result) => {
            //@ts-ignore
            const categories: string[] = new Set<string>(
              Object.values(JSON.parse(JSON.stringify(result)))
                //@ts-ignore
                .map((c) => Object.values(c).flat())
                .flat()
                //@ts-ignore
                .map((c) => `${c.name}//${c.title}`)
            );
            set_category(Array.from(categories));
          });
          json
          return doctors;
        }
        return { error: "Failed to parse doctors" };
      } catch (e) {
        return { error: "Failed to parse doctors" };
      }
    },
  });

  const [isFilterChange, setIsFilterChange] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log("error");
    }
    if (isSuccess) {
      let new_doctors = data as Doctors[];
      set_doctors((prev) => {
        if (isFilterChange) {
          // Replace the doctors if it's a filter change
          set_visable_doctor(new_doctors.length);
          set_ended(new_doctors.length < 40 || new_doctors.length === 0);
          return new_doctors;
        } else {
          // Append the doctors if it's a pagination change
          set_visable_doctor(prev.length + new_doctors.length);
          if (new_doctors.length < 40 || new_doctors.length === 0) {
            set_ended(true);
          }
          return [...prev, ...new_doctors];
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
      className={`w-screen h-full flex justify-center items-center flex-col ${
        app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
      }`}
    >
      <section id="search_bar" className="flex flex-row mb-8 text-text-800">
        <button
          className="w-12 mr-5 h-12  btn p-0 btn-secondary"
          onClick={() =>
            (window.location.href = `/category/${title}?page=0${
              query.gender ? `&gender=${query.gender}` : ""
            }${query.search_bar ? `&search_bar=${query.search_bar}` : ""}${
              query.order === "asc" ? `&order=desc` : "&order=asc"
            }`)
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
        <label
          htmlFor="filter-dialog"
          className="btn btn-secondary btn-sm w-12 ml-5 h-12 p-0"
        >
          <FilterIcon className="" />
        </label>
        <input type="checkbox" id="filter-dialog" className="modal-toggle" />
        <div
          className={`modal ${
            app.appConfig.language === "fa"
              ? "text-right font-fa"
              : "text-left font-Roboto"
          } text-text-800`}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg w-full">{t("filter.title")}</h3>
            <form
              className="space-y-4 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const genderSelect = document.getElementById(
                  "gender"
                ) as HTMLSelectElement;
                const categorySelect = document.getElementById(
                  "category"
                ) as HTMLSelectElement;
                const genderValue = genderSelect.selectedOptions[0].value;
                const searchBarValue = query.search_bar;
                //@ts-ignore
                document.getElementById("filter-dialog")!.checked = false;
                window.location.href = `/category/${
                  categorySelect.selectedOptions[0].id
                }?page=0${
                  ["man", "woman"].includes(genderValue)
                    ? `&gender=${genderValue}`
                    : ""
                }${searchBarValue ? `&search_bar=${searchBarValue}` : ""}`;
              }}
            >
              <div className="form-control">
                <label
                  className={`label  ${
                    app.appConfig.language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`label-text w-full ${
                      app.appConfig.language === "fa"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {t("gender.title")}
                  </span>
                </label>
                <select
                  id="gender"
                  className={`select select-bordered ${
                    app.appConfig.language === "fa" ? "text-right" : "text-left"
                  }`}
                  defaultValue={t("gender.title")}
                >
                  <option disabled>{t("gender.title")}</option>
                  <option id="man" value="man">
                    {t("gender.man")}
                  </option>
                  <option id="woman" value="woman">
                    {t("gender.woman")}
                  </option>
                  <option id="both" value="both">
                    {t("gender.both")}
                  </option>
                </select>
              </div>
              <div className="form-control">
                <label
                  className={`label ${
                    app.appConfig.language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`label-text w-full ${
                      app.appConfig.language === "fa"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {t("filter.category")}
                  </span>
                </label>
                <select
                  id="category"
                  className={`select select-bordered ${
                    app.appConfig.language === "fa" ? "text-right" : "text-left"
                  }`}
                >
                  {category
                    .map((itm) => itm.split("//"))
                    .map((itm) => (
                      <option
                        id={itm[1]}
                        key={itm[1]}
                        selected={itm[1] === title}
                      >
                        {i18.language === "fa" ? itm[0] : itm[1]}
                      </option>
                    ))}
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-secondary">
                  {t("filter.apply")}
                </button>
                <label
                  htmlFor="filter-dialog"
                  className="btn bg-text-800 hover:bg-text-600 text-text-300"
                >
                  {t("filter.cancel")}
                </label>
              </div>
            </form>
          </div>
        </div>
      </section>
      <div id="doctors" className="flex flex-col md:flex-row">
        <InfiniteScroll
          hasMore={!ended}
          loader={<Loader size={40} color={[6, 147, 126]} />}
          dataLength={visable_doctor}
          next={() => set_page(page + 1)}
          className="flex flex-row flex-wrap justify-center items-center"
        >
          {Array.from({ length: visable_doctor }).map((_, idx) => (
            <DocCard
              key={idx}
              align={app.appConfig.language === "fa" ? "right" : "left"}
              item={doctors[idx]}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Category;
