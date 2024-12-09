import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Spin } from "antd";

export const AuthBarrier: React.FC = () => {
  const auth = useAuth();
  

  console.log("auth", auth);

  if (auth.isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (!auth.isAuthenticated) {
    console.log("not authenticated");
    auth.signinRedirect().then(() => {
      console.log("redirected");
    });
  }

  return <Outlet />;
}; 