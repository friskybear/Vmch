import { Globe } from "lucide-react";

import { useTranslation } from "react-i18next";
import { useRef, useEffect, useContext } from "react";
import { AppContext } from "@/main";

function LanguageSelector() {
  const [_, i18] = useTranslation();
  const app = useContext(AppContext);
  const ref = useRef<HTMLDetailsElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    document.addEventListener("click", (event) => {
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target as Node)) {
          dropdown.removeAttribute("open");
        }
      });
    });
  }, [ref]);
  return (
    <>
      <details
        className="dropdown z-40"
        id="lang"
        onClick={(e) => e.stopPropagation()}
        ref={ref}
      >
        <summary className="btn bg-transparent btn-xs m-1 h-10 w-10 border-none">
          <Globe className="h-5 w-5" />
        </summary>
        <ul className="menu dropdown-content bg-background-100 text-text-800 rounded-box z-10 w-24 p-2 shadow">
          <li>
            <a
              onClick={() => {
                (
                  document.getElementById("lang") as HTMLDetailsElement
                ).removeAttribute("open");
                i18.changeLanguage("fa");
                app.setAppConfig({
                  ...app.appConfig,
                  language: "fa",
                  is_phone: app.appConfig.is_phone,
                });
                window.location.reload();
              }}
            >
              🇮🇷 Fa
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                (
                  document.getElementById("lang") as HTMLDetailsElement
                ).removeAttribute("open");
                i18.changeLanguage("en");
                app.setAppConfig({
                  ...app.appConfig,
                  language: "en",
                  is_phone: app.appConfig.is_phone,
                });
                window.location.reload();
              }}
            >
              🇬🇧 En
            </a>
          </li>
        </ul>
      </details>
    </>
  );
}
export default LanguageSelector;
