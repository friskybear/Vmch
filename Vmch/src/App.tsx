import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";

function App() {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return 1;
    },
  });
  if (query.isSuccess && !query.error) {
invoke("command_name");
  }

  console.log(import.meta.env["VITE_IP"]);
  return (
    <>
      <header>a</header>
      <Outlet />
    </>
  );
}

export default App;

function setup() {}
