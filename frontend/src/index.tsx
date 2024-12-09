import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import './styles/global.css';
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./providers/authelia/oidc_config";

// console.clear()

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
