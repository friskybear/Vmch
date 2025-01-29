import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./i18";
import Home from "./Pages/Home/Home";
import { AppManager } from "./lib/utils";
//@ts-ignore
import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import i18next from "i18next";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ComingSoon from "./Pages/ComingSoon/ComingSoon";
import Category from "./Pages/Category/Category";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Sessions from "./Pages/Sessions/Sessions";
import Chat from "./Pages/Chat/Chat";
import Settings from "./Pages/Dashboard/Settings";
import Notification from "./Pages/Notification/Notification";
interface AppContextType {
  appConfig: AppManager;
  setAppConfig: Dispatch<SetStateAction<AppManager>>;
}

export const AppContext = createContext<AppContextType>({
  appConfig: new AppManager({}),
  setAppConfig: () => {},
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appConfig, setAppConfig] = useState<AppManager>(new AppManager({}));
  i18next.changeLanguage(appConfig.language);
  useEffect(() => {
    localStorage.setItem("appConfig", JSON.stringify(appConfig));
  }, [appConfig]);
  let element = document.getElementsByTagName("html")[0];
  if (element) {
    element.setAttribute("data-theme", appConfig.theme);
    element.setAttribute("class", appConfig.theme);
  }
  return (
    <AppContext.Provider value={{ appConfig, setAppConfig }}>
      {children}
    </AppContext.Provider>
  );
};

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="Category/:title" element={<Category />} />
            <Route path="Dashboard/" element={<Dashboard />}>
              <Route path="Notification" element={<Notification />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="Sessions/" element={<Sessions />}>
                <Route path=":id" element={<Chat />} />
              </Route>
            </Route>
          </Route>
          <Route path="SignIn" element={<SignIn />} />
          <Route path="ForgotPassword" element={<ComingSoon />} />
          <Route path="SignUp" element={<SignUp />} />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
