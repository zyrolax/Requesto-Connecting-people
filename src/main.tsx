import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./components/AuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
if (import.meta.env.PROD && !clientId) {
  console.error("VITE_GOOGLE_CLIENT_ID is required in production. Set it in your environment.");
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <ErrorBoundary>
    <GoogleOAuthProvider clientId={clientId || "YOUR_GOOGLE_CLIENT_ID"}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </ErrorBoundary>
);
