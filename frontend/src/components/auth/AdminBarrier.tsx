import { Navigate, Outlet } from "react-router-dom";
import { useAuthelia } from "../../hooks/useAuthelia";
import { Spin } from "antd";

export const AdminBarrier: React.FC = () => {
  const { isAdmin, isLoading } = useAuthelia();

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}; 