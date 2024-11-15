import { useState } from "react";
export type IAppProps = {
  change_on_system: true;
};
function changeTheme(theme: "light" | "dark") {
  const element = document.getElementById("html")!;
  element.setAttribute("data-theme", theme);
  element.setAttribute("class", theme);
}
export function ThemeSwitch(props: IAppProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  if (props.change_on_system) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        changeTheme(newColorScheme);
      });
  }
  return (
    <button
      className=" h-2 w-2 absolute"
      type="button"
      onClick={() => {
        console.log(theme);
        changeTheme(theme === "light" ? "dark" : "light");
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      Change Theme
    </button>
  );
}
