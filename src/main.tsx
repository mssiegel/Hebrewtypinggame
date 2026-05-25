import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles/index.css";
import App from "./app/App.tsx";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
