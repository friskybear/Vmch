import { AppContext } from "@/main";
import { Selector } from "@/Components/Selector/Selector";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Admins, Doctors, Patients, Stats } from "./Admin";

function Dashboard() {
  const app = useContext(AppContext);
  const [t, i18n] = useTranslation();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    switch (pathname) {
      case "/Dashboard":
        return t("site.dashboard.title");
      case "/Dashboard/Sessions":
        return t("site.dashboard.Sessions");
      case "/Dashboard/Notification":
        return t("site.dashboard.Notification");
      case "/Dashboard/Settings":
        return t("site.dashboard.Settings");
      default:
        return t("site.dashboard.title");
    }
  });
  useEffect(() => {
    switch (activeTab) {
      case t("site.dashboard.title"):
        if (pathname !== "/Dashboard") nav("/Dashboard");
        break;
      case t("site.dashboard.Sessions"):
        if (pathname !== "/Dashboard/Sessions") nav("/Dashboard/Sessions");
        break;
      case t("site.dashboard.Notification"):
        if (pathname !== "/Dashboard/Notification")
          nav("/Dashboard/Notification");
        break;
      case t("site.dashboard.Settings"):
        if (pathname !== "/Dashboard/Settings") nav("/Dashboard/Settings");
        break;
    }
  }, [activeTab, pathname]);

  return (
    <div className=" w-full  p-4  flex-col flex  space-y-1">
      {/* Tab Navigation */}
      <Selector
        defaultValue={activeTab}
        onSelect={setActiveTab}
        items={[
          t("site.dashboard.title"),
          t("site.dashboard.Sessions"),
          t("site.dashboard.Notification"),
          t("site.dashboard.Settings"),
        ]}
        name="dashboard"
        divClassName="flex-row min-h-11 "
        className="w-full noiseBackground bg-background-200"
        dynamicClassName=" noiseBackground bg-primary-300"
      />

      {activeTab === t("site.dashboard.title") ? (
        app.appConfig.user?.role === "admin" ? (
          <Admin />
        ) : app.appConfig.user?.role === "patient" ? (
          <Patient />
        ) : app.appConfig.user?.role === "doctor" ? (
          <Doctor />
        ) : null
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Dashboard;

function Admin() {
  const [t, _] = useTranslation();
  const [search_params, set_search_params] = useSearchParams();
  const loc = useLocation();
  const [selected, setSelected] = useState(
    search_params.get("selected") || t("site.dashboard.stats")
  );
  const navigate = useNavigate();
  useEffect(() => {
    set_search_params({ selected: selected });
    navigate(`${loc.pathname}?selected=${selected}`);
  }, [selected, navigate]);
  return (
    <div className="flex flex-col space-y-4 h-full w-full">
      <Selector
        defaultValue={selected}
        onSelect={setSelected}
        key={selected}
        items={[
          t("site.dashboard.stats"),
          t("site.dashboard.admin"),
          t("site.dashboard.patient"),
          t("site.dashboard.doctor"),
        ]}
        name="admin"
        divClassName="flex-row min-h-11 "
        className="w-full noiseBackground bg-primary-300 "
        dynamicClassName="bg-background-200 noiseBackground"
      />
      {selected === t("site.dashboard.stats") ? (
        <Stats />
      ) : selected === t("site.dashboard.admin") ? (
        <Admins />
      ) : selected === t("site.dashboard.patient") ? (
        <Patients />
      ) : selected === t("site.dashboard.doctor") ? (
        <Doctors />
      ) : null}
    </div>
  );
}
function Patient() {
  return <div>Patient</div>;
}
function Doctor() {
  const app = useContext(AppContext);
    
  return <div>Doctor</div>;
}
