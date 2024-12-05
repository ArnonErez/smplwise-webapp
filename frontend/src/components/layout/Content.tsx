// import { CanAccess } from "@refinedev/core";
// import { Outlet, Route, Routes } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useAuthelia } from "../../hooks/useAuthelia";
// import { useGrafana } from "../../hooks/useGrafana";
// import { OverviewPage } from "../../pages/overview";
// import { AlertsList } from "../../pages/alerts/list";
// import { AlertsShow } from "../../pages/alerts/show";
// import { DashboardsList } from "../../pages/dashboards/list";
// import { DashboardShow } from "../../pages/dashboards/show";
// import { CustomersPage } from "../../pages/admin/customers";
// import { CatchAllNavigate } from "@refinedev/react-router-v6";

// // Create a wrapper component for protected list routes
// const ProtectedListRoute: React.FC<{ 
//     component: React.ComponentType; 
//     resource: string;
// }> = ({ component: Component, resource }) => {
//     const { isAdmin } = useAuthelia();
//     const { user: grafanaUser } = useGrafana();
//     const orgId = grafanaUser?.orgId;
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         if (orgId && !isAdmin) {
//             navigate(`/${resource}/${orgId}/${resource === 'alerts' ? 'active' : 'overview'}`, { replace: true });
//         }
//     }, [orgId, isAdmin]);
    
//     if (orgId && !isAdmin) {
//         return null;
//     }
    
//     return <Component />;
// };

// export const RefineContent: React.FC = () => {
//     return (
//         <Routes>
//             <Route index element={<OverviewPage />} />
//             <Route 
//                 path="/alerts" 
//                 element={<ProtectedListRoute component={AlertsList} resource="alerts" />} 
//             />
//             <Route path="/alerts/:customerId" element={<AlertsShow />} />
//             <Route path="/alerts/:customerId/:type" element={<AlertsShow />} />
//             <Route 
//                 path="/dashboards" 
//                 element={<ProtectedListRoute component={DashboardsList} resource="dashboards" />} 
//             />
//             <Route path="/dashboards/:customerId" element={<DashboardShow />} />
//             <Route path="/dashboards/:customerId/:type" element={<DashboardShow />} />
//             <Route
//                 element={
//                     <CanAccess
//                         key="admin"
//                         resource="admin"
//                         action="list"
//                         fallback={<CatchAllNavigate to="/" />}
//                     >
//                         <Outlet />
//                     </CanAccess>
//                 }
//             >
//                 <Route key="customers" path="/admin/customers/*" element={<CustomersPage />} />
//             </Route>
//         </Routes>
//     );
// };