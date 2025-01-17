import { AppContext } from "@/main";
import { Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const ThemeSwitch = () => {
  const app = useContext(AppContext);

  const [window_theme, setWindowTheme] = useState(app.appConfig.theme);

  useEffect(() => {
    let element = document.getElementsByTagName("html")[0];
    if (element) {
      element.setAttribute("data-theme", window_theme);
      element.setAttribute("class", window_theme);
    }
    localStorage.setItem("theme", window_theme);
    app.setAppConfig({
      ...app.appConfig,
      theme: window_theme,
      is_phone: app.appConfig.is_phone,
    });
  }, [window_theme]);
  return (
    <>
      <div
        className="btn bg-transparent btn-xs m-1 h-10 w-10 border-none"
        onClick={() =>
          setWindowTheme(window_theme === "dark" ? "light" : "dark")
        }
      >
        {window_theme === "dark" ? (
          <Moon className="text-text-800" />
        ) : (
          <Sun className="text-text-800" />
        )}
      </div>
    </>
  );
};

export default ThemeSwitch;
