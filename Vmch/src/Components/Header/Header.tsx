import { NavLink, redirect } from "react-router";
import {
  Home,
  LogOut,
  Menu,
  User,
  Users,
  LayoutDashboard,
  HelpCircle,
  Phone,
} from "lucide-react";
import { logo } from "@/icons";
import { useTranslation } from "react-i18next";
import ThemeSwitch from "@/Components/ThemeSwitch/Switch_Theme";
import LanguageSelector from "@/Components/LanguageSelector/LanguageSelector";
import { useContext } from "react";
import { AppContext } from "@/main";
export default function Header() {
  const [t, i18] = useTranslation();
  const app = useContext(AppContext);
  return (
    <header
      className={`h-20  flex justify-between pr-5 pl-5 items-center select-none bg-transparent`}
    >
      <div
        id="logo"
        className="flex justify-between items-center w-32 h-10 pr-3 cursor-pointer"
        onClick={() => {
          redirect("/Home");
        }}
      >
        {logo(30)}
        <h1
          className={`text-3xl ${
            i18.language == "fa"
              ? "font-fancy-fa mb-2 font-extrabold pr-6"
              : "font-fancy-en"
          } bg-gradient-to-tr from-primary-800 via-background-100 to-background-50  to-[160%] bg-clip-text text-transparent ml-1   `}
        >
          {t("site.name")}
        </h1>
      </div>
      <nav
        className={`hidden md:flex space-x-5 text-text-800  w-80   justify-between items-center h-10 ${
          i18.language == "fa" ? "font-fa font-extrabold" : "font-en font-bold"
        }`}
      >
        <NavLink
          to="/doctors"
          className="bflex justify-center items-center text-center h-6 w-24 "
        >
          {t("site.tabs.doctor")}
        </NavLink>
        <NavLink
          to="/about_us"
          className="flex justify-center items-center text-center  h-6 w-24"
        >
          {t("site.tabs.about_us")}
        </NavLink>
        <NavLink
          to="/contact"
          className="flex justify-center items-center text-center  h-6 w-24"
        >
          {t("site.tabs.contact")}
        </NavLink>
      </nav>
      <div className="flex space-x-4">
        <div id="system-config" className="flex space-x-4">
          <LanguageSelector />
          <ThemeSwitch />
        </div>
        <div id="account" className="hidden md:flex pt-1">
          {app.appConfig.user ? (
            <details className="dropdown z-40" id="user_avatar">
              <summary
                className="text-text-800  hover:bg-primary-700  btn btn-outline hover:border-primary-700 font-bold min-h-2 h-10 w-36 flex justify-around items-center"
                onClick={() => redirect("/login")}
              >
                <User className="h-5 w-5" />
                {app.appConfig.user.fullName.split("-")[0].length > 10
                  ? app.appConfig.user.fullName.split("-")[0].substring(0, 9) +
                    "..."
                  : app.appConfig.user.fullName.split("-")[0]}
              </summary>
              <ul className="menu dropdown-content bg-background-100 text-text-800 rounded-box z-[1] p-2 shadow w-36 space-y-2 ">
                <li className="">
                  <NavLink
                    to={"/dashboard"}
                    onClick={() => {
                      (
                        document.getElementById(
                          "user_avatar"
                        ) as HTMLDetailsElement
                      ).removeAttribute("open");
                    }}
                  >
                    {t("site.tabs.dashboard")}
                  </NavLink>
                </li>
                <li className="">
                  <NavLink
                    to={"/dashboard/notification"}
                    onClick={() => {
                      (
                        document.getElementById(
                          "user_avatar"
                        ) as HTMLDetailsElement
                      ).removeAttribute("open");
                    }}
                  >
                    {t("site.tabs.notification")}
                  </NavLink>
                </li>
                <li className="">
                  <NavLink
                    to="/sessions"
                    onClick={() => {
                      (
                        document.getElementById(
                          "user_avatar"
                        ) as HTMLDetailsElement
                      ).removeAttribute("open");
                      redirect("/dashboard/sessions");
                    }}
                  >
                    {t("site.tabs.sessions")}
                  </NavLink>
                </li>
                <li className="">
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          "user_avatar"
                        ) as HTMLDetailsElement
                      ).removeAttribute("open");
                      app.setAppConfig((prev) => ({
                        ...prev,
                        user: null,
                        is_phone: prev.is_phone,
                      }));
                    }}
                  >
                    {t("site.tabs.sign_out")}
                  </button>
                </li>
              </ul>
            </details>
          ) : (
            <NavLink
              to={"/login"}
              className="text-text-800  hover:bg-primary-700  btn btn-outline hover:border-primary-700 font-bold min-h-2 h-10 w-44 flex justify-around items-center"
            >
              <User className="h-5 w-5" />
              {t("site.tabs.sign_in")} / {t("site.tabs.sign_up")}
            </NavLink>
          )}
        </div>

        <div className=" drawer-end md:hidden flex">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle " />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className=" btn btn-xs  h-10 min-h-5 min-w-5 w-10 bg-transparent border-none mt-1"
            >
              <Menu />
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-background-50 text-text-800 min-h-full w-52 rounded-tl-md rounded-bl-md p-4 flex-col flex justify-between">
              <div>
                {app.appConfig.user ? (
                  <li className="mb-2 mt-2">
                    <NavLink
                      to={"/dashboard"}
                      className={
                        i18.language === "fa" ? "font-fa" : "font-roboto"
                      }
                    >
                      <LayoutDashboard className="h-5 w-5 mr-1" />
                      {t("site.tabs.dashboard")}
                    </NavLink>
                  </li>
                ) : (
                  <li className="mb-2 mt-2">
                    <NavLink
                      to={"/Home"}
                      className={
                        i18.language === "fa" ? "font-fa" : "font-roboto"
                      }
                    >
                      <Home className="h-5 w-5 mr-1" />
                      {t("site.tabs.home")}
                    </NavLink>
                  </li>
                )}
                <li className="mb-2 mt-2">
                  <NavLink
                    to={"/doctors"}
                    className={
                      i18.language === "fa" ? "font-fa" : "font-roboto"
                    }
                  >
                    <Users className="h-5 w-5 mr-1" />
                    {t("site.tabs.doctor")}
                  </NavLink>
                </li>
                <li className="mb-2 mt-2">
                  <NavLink
                    to={"/about_us"}
                    className={
                      i18.language === "fa" ? "font-fa" : "font-roboto"
                    }
                  >
                    <HelpCircle className="h-5 w-5 mr-1" />
                    {t("site.tabs.about_us")}
                  </NavLink>
                </li>
                <li className="mb-2 mt-2">
                  <NavLink
                    to={"/contact"}
                    className={
                      i18.language === "fa" ? "font-fa" : "font-roboto"
                    }
                  >
                    <Phone className="h-5 w-5 mr-1" />
                    {t("site.tabs.contact")}
                  </NavLink>
                </li>
                {!app.appConfig.user && (
                  <NavLink
                    to={"/login"}
                    className={`text-text-800 hover:bg-primary-700 btn btn-outline hover:border-primary-700 font-bold min-h-2 h-12 w-40 flex flex-row p-2 justify-around items-center mb-2 mt-2 ${
                      i18.language === "fa" ? "font-fa" : "font-roboto"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    {t("site.tabs.sign_in")} / {t("site.tabs.sign_up")}
                  </NavLink>
                )}
              </div>
              <div>
                {app.appConfig.user && (
                  <li className="mb-2 mt-2">
                    <button
                      onClick={() =>
                        app.setAppConfig((prev) => ({
                          ...prev,
                          user: null,
                          is_phone: prev.is_phone,
                        }))
                      }
                      className={
                        i18.language === "fa" ? "font-fa" : "font-roboto"
                      }
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      {t("site.tabs.sign_out")}
                    </button>
                  </li>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
