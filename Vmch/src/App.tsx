import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useEffect, useRef } from "react";
let index = 0;
function App() {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      index = index + 1;
      console.log(index);
      if (index == 1) return 1;
      throw new Error("bad");
    },
  });

  if (query.isError) {
    invoke("reconnect");
    setTimeout(() => {
      query.refetch();
    }, 10000);
  }
  if (query.isSuccess) {
    invoke("connected");
  }

  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.classList.add("dark");
      setTimeout(() => {
        headerRef.current?.classList.remove("dark");
      }, 0);
    }
  }, []);

  return (
    <div className="text-left">
      <header ref={headerRef} className="h-[10dvh] bg-background-50">
        <button className="h-10 w-10 bg-primary-900"> ge</button>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
