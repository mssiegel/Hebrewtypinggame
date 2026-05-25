import { Outlet } from "react-router";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

export default function Root() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}
