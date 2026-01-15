import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PageTransition } from "./components/ui";
import { Index, Dashboard } from "./pages";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Index />
          </PageTransition>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
