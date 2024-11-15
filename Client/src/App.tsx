import "react";
import "./App.css";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import WebSocket from "@tauri-apps/plugin-websocket";
import { webviewWindow } from "@tauri-apps/api";
import { logo } from "./icons/icons";
import { ThemeSwitch } from "./Components/ThemeSwitch/ThemeSwitch";
function App() {
  const ws_init_connection = async () => {
    const ws = await WebSocket.connect("ws://127.0.0.1:8080/ws");
    ws.addListener((msg) => {
      console.log(msg);
    });
    webviewWindow.getCurrentWebviewWindow().onCloseRequested(() => {
      ws.disconnect();
    });
    ws.send(
      JSON.stringify({
        reason: "logged_in",
        uuid: "8bc90caa-5a27-4def-bb69-5e6f8c2c44f2",
      })
    );
  };
  ws_init_connection();
  return (
    <>
      <ThemeSwitch change_on_system={true} />
      <header className="h-[8dvh] mt-3">{logo(8, 8)}</header>
      <main>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  );
}

export default App;
