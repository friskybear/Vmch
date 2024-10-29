import { createRootRoute, createRoute } from "@tanstack/react-router";
import App from "./App";
import Home from "./Pages/Home";


const rootRoute = createRootRoute({
    component:App
})

const home = createRoute({
    getParentRoute:()=>rootRoute,
    path:"/",
    component:Home
})

export const routeTree = rootRoute.addChildren([home]);
