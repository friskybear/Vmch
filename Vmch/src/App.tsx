import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import "./App.css";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "./main";
import Header from "@/Components/Header/Header";
import SplashScreen from "./Pages/SplashScreen/SplashScreen";
import { invoke } from "@tauri-apps/api/core";
import Fail from "./Pages/Fail/Fail";
import DotPanel from "./Components/DotPanel/DotPanel";

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
      if (result == "ok") {
        return result;
      } else {
        throw new Error(result as string);
      }
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
            <DotPanel className="[mask-image:radial-gradient(60dvh_circle_at_top,#ffffff99_10%,#ffffff66_50%,transparent)] opacity-80 dark:opacity-55 fill-primary-800" />
          </div>
        )
      ) : null}
    </>
  );
}

export default App;
