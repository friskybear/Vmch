import * as React from "react";
import { useState } from "react";
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type IAppProps = {
  change_on_system: true;
};
function changeTheme(theme: "light" | "dark") {
  const element = document.getElementsByName("html")[0];
  element.setAttribute("data-theme", theme);
  element.setAttribute("class", theme);
}
export function ThemeSwitch(props: IAppProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
//   if (props.change_on_system) {
//     window
//       .matchMedia("(prefers-color-scheme: dark)")
//       .addEventListener("change", (event) => {
//         const newColorScheme = event.matches ? "dark" : "light";
//         changeTheme(newColorScheme);
//       });
//   }

  return <div>a</div>;
}
