import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbarProvider } from "@refinedev/kbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@refinedev/antd/dist/reset.css";
import { App as AntdApp } from "antd";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ColorModeContextProvider } from "./contexts/color-mode";
// import { RefineContent } from "./components/layout/Content";
import { AuthCallback } from "./components/auth/AuthCallback";
// import { useAuth } from "./hooks/useAuth";
import { useAuth } from "react-oidc-context";
import { OverviewPage } from "./pages/overview";
import { CanAccess, Refine } from "@refinedev/core";
import { dataProvider } from "./providers/dataProvider";
import { resources } from "./config/resources";
import { CatchAllNavigate } from "@refinedev/react-router-v6";
import { AlertsList } from "./pages/alerts/list";
import { AlertsShow } from "./pages/alerts/show";
import { DashboardsList } from "./pages/dashboards/list";
import { useAuthelia } from "./hooks/useAuthelia";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { DashboardShow } from "./pages/dashboards/show";
import { CustomersList } from "./pages/admin/customers/list";
import { AppLayout } from "./components/layout/AppLayout";
import { authProvider } from "./providers/authProvider";
import { SilentCallback } from "./components/auth/SilentCallback";
import { CustomersPage } from "./pages/admin/customers";
import { AuthBarrier } from "./components/auth/AuthBarrier";
import { AdminBarrier } from "./components/auth/AdminBarrier";
import { Welcome } from "../public/welcome";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <ColorModeContextProvider>
            <AntdApp>
                <Refine
                  dataProvider={dataProvider}
                  authProvider={authProvider}
                  // resources={[]}
                >
                  <Routes>
                    <Route path="callback" element={<AuthCallback />} />
                    <Route path="silent-callback" element={<SilentCallback />} />
                    <Route path="/" element={<Welcome />} />
                    <Route element={<AuthBarrier />}>
                      <Route element={<AppLayout />}>
                        <Route path="/app" element={<OverviewPage />} />
                        <Route path="alerts/*" element={<AlertsShow />}>
                          <Route path=":customerId" element={<AlertsShow />} />
                          <Route path=":customerId/:type" element={<AlertsShow />} />
                        </Route>
                        <Route path="dashboards/*" element={<DashboardShow />}>
                          <Route path=":customerId" element={<DashboardShow />} />
                        </Route>
                        <Route element={<AdminBarrier />}>
                          <Route path="admin">
                            <Route path="customers/*" element={<CustomersPage />} />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                  </Routes>
                </Refine>
            </AntdApp>
          </ColorModeContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
