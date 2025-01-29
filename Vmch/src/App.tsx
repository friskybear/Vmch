import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import "./App.css";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "./main";
import Header from "@/Components/Header/Header";
import SplashScreen from "./Pages/SplashScreen/SplashScreen";
import { invoke } from "@tauri-apps/api/core";
import Fail from "./Pages/Fail/Fail";
import { Admin, Doctor, Patient } from "./lib/utils";

function App() {
  const [state, setState] = useState("");
  const [showSplash, setShowSplash] = useState<boolean | null>();
  const app = useContext(AppContext);
  useEffect(() => {
    const show_cond = async () => {
      const result = await invoke<boolean>("splash");
      setShowSplash(result);
    };
    show_cond();
  }, []);
  const query = useQuery({
    queryKey: ["check_connection"],
    retry: 2,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await invoke("fetch_text", {
        url: `${app.appConfig.server}/Health`,
      });
      if (result == "ok" && !app.appConfig.user) {
        return result;
      } else if (!app.appConfig.user) {
        throw new Error(result as string);
      } else {
        invoke<JSON | "Unauthorized">("post", {
          url: `${app.appConfig.server}/sign_in`,
          payload: {
            email: app.appConfig.user.email,
            password: app.appConfig.user.password,
          },
        }).then(async (res) => {
          if (res === "Unauthorized") {
            app.setAppConfig({
              ...app.appConfig,
              user: null,
              is_phone: app.appConfig.is_phone,
            });
            //@ts-ignore
          } else if (res["Doctor"] || res["Admin"] || res["Patient"]) {
            //@ts-ignore
            if (res["Doctor"]) {
              //@ts-ignore
              const doctor = res["Doctor"];
              //@ts-ignore
              doctor["password"] = app.appConfig.user.password;
              const user: Doctor = new Doctor(doctor);
              user.id = user.id.toString();
              app.setAppConfig({
                ...app.appConfig,
                user: user,
                is_phone: app.appConfig.is_phone,
              });
              //@ts-ignore
            } else if (res["Admin"]) {
              //@ts-ignore
              const admin = res["Admin"];
              //@ts-ignore
              admin["password"] = app.appConfig.user.password;
              const user: Admin = new Admin(admin);
              user.id = user.id.toString();
              app.setAppConfig({
                ...app.appConfig,
                user: user,
                is_phone: app.appConfig.is_phone,
              });
              //@ts-ignore
            } else if (res["Patient"]) {
              //@ts-ignore
              const patient = res["Patient"];
              //@ts-ignore
              patient["password"] = app.appConfig.user.password;
              const user: Patient = new Patient(patient);
              user.id = user.id.toString();
              app.setAppConfig({
                ...app.appConfig,
                user: user,
                is_phone: app.appConfig.is_phone,
              });
            }
          } else {
            app.setAppConfig({
              ...app.appConfig,
              user: null,
              is_phone: app.appConfig.is_phone,
            });
          }
        });
      }
      return "ok";
    },
  });

  useEffect(() => {
    if (query.isError) {
      setState("fail");
      console.error("Error fetching data:", query.error);
      if (showSplash) {
        const timer = setTimeout(() => {
          query.refetch();
        }, 10000);
        return () => clearTimeout(timer);
      }
    }

    if (query.isSuccess) {
      setState("success");
      if (showSplash) {
        const delay = setTimeout(() => {
          setShowSplash(false);
          if (!app.appConfig.is_phone()) {
            invoke("exit_splash_desktop");
          }
        }, 3000);
        return () => clearTimeout(delay);
      }
    }
  }, [query.isSuccess, query.isError, showSplash]);

  return (
    <>
      {showSplash !== undefined ? (
        showSplash ? (
          <SplashScreen state={state} />
        ) : state === "fail" ? (
          <div className="relative bg-background-50 w-screen h-screen">
            <Fail />
          </div>
        ) : (
          <div className="relative bg-background-50 min-h-screen min-w-screen ">
            <Header />
            <Outlet />
          </div>
        )
      ) : null}
    </>
  );
}

export default App;
