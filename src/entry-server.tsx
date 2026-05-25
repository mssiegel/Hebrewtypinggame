import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import Landing from "./app/pages/Landing.tsx";
import "./styles/index.css";

export function renderHome() {
  return renderToString(
    <StrictMode>
      <StaticRouter location="/">
        <Landing />
      </StaticRouter>
    </StrictMode>,
  );
}
