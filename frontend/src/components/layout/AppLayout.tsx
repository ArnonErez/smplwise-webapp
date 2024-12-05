import React, { useState, useEffect } from "react";
import { Layout, theme } from "antd";
import type { GlobalToken } from 'antd/es/theme/interface';
import { Header } from "../header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "react-oidc-context";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export const AppLayout: React.FC = () => {
  const auth = useAuth();
  const { token } = theme.useToken();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return <div>Redirecting to login...</div>;
  }

  console.log("auth.user", auth.user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout 
      hasSider
      style={{ 
        overflow: 'hidden',
        height: '100vh',
      }} 
      >
      
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      {/* <Layout > */}
        {/* <Header /> */}
        <Layout.Content 
        style={{ 
          padding: "0px 5px",
        }}>
          <Outlet />
        </Layout.Content>
      {/* </Layout> */}
    </Layout>
  );
};
