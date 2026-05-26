import { createBrowserRouter } from "react-router";
import Root from "./Root.tsx";
import Landing from "./pages/Landing.tsx";
import Game from "./pages/Game.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "en", Component: Landing },
      { path: "game", Component: Game },
      { path: "en/game", Component: Game },
    ],
  },
]);
