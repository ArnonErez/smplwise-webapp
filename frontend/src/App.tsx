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
import { useGrafana } from "./hooks/useGrafana";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { DashboardShow } from "./pages/dashboards/show";
import { CustomersList } from "./pages/admin/customers/list";
import { AppLayout } from "./components/layout/AppLayout";
import { authProvider } from "./providers/authProvider";
import { SilentCallback } from "./components/auth/SilentCallback";
import { CustomersPage } from "./pages/admin/customers";


function App() {
  const queryClient = new QueryClient();
  // const { isLoading, isAuthenticated } = useAuth();
  // const auth = useAuth();

  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("OIDC Auth User:", auth.user);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }


  // const ProtectedListRoute: React.FC<{ 
  //   component: React.ComponentType; 
  //   resource: string;
  // }> = ({ component: Component, resource }) => {
  //   const { isAdmin } = useAuthelia();
  //   const { user: grafanaUser } = useGrafana();
  //   const orgId = grafanaUser?.orgId;
  //   const navigate = useNavigate();
    
  //   useEffect(() => {
  //       if (orgId && !isAdmin) {
  //           navigate(`/${resource}/${orgId}/${resource === 'alerts' ? 'active' : 'overview'}`, { replace: true });
  //       }
  //   }, [orgId, isAdmin]);
    
  //   if (orgId && !isAdmin) {
  //       return null;
  //   }
    
  //   return <Component />;
  // };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* <RefineKbarProvider> */}
          <ColorModeContextProvider>
            <AntdApp>
              {/* <DevtoolsProvider> */}
                <Refine
                  dataProvider={dataProvider}
                  authProvider={authProvider}
                  // resources={[]}
                >
                  <Routes>
                    <Route path="callback" element={<AuthCallback />} />
                    <Route path="silent-callback" element={<SilentCallback />} />
                    <Route element={ <AppLayout /> }>
                      <Route path="/" element={<OverviewPage />} />
                      <Route path="alerts/*" element={<AlertsShow />} />
                        {/* <Route path=":customerId" element={<AlertsShow />} />
                        <Route path=":customerId/:type" element={<AlertsShow />} /> */}
                      {/* </Route> */}
                      <Route path="dashboards*" element={<DashboardShow />}>
                        <Route path=":customerId" element={<DashboardShow />} />
                        {/* <Route path=":customerId/:type" element={<DashboardShow />} /> */}
                      </Route>
                      <Route path="admin">
                        <Route key="customers" path="customers/*" element={<CustomersPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </Refine>
                {/* <DevtoolsPanel /> */}
              {/* </DevtoolsProvider> */}
            </AntdApp>
          </ColorModeContextProvider>
        {/* </RefineKbarProvider> */}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
