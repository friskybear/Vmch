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
} from "react";
import i18next from "i18next";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";

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
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
