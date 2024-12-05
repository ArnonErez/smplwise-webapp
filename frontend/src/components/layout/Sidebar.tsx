import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    HomeOutlined, 
    DashboardOutlined, 
    SettingOutlined, 
    MenuFoldOutlined, 
    MenuUnfoldOutlined, 
    TeamOutlined,
    AlertOutlined,
    DownOutlined,
    LogoutOutlined,
    BulbOutlined,
    BulbFilled,
    UserOutlined
} from "@ant-design/icons";
import { useGetIdentity, useList, useLogout } from "@refinedev/core";
import { Layout, Menu, theme, Flex, Button, Select, Space, MenuProps, Dropdown, Typography } from "antd";
import { useAuth } from "react-oidc-context";
import { Logo } from "../Logo";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { ColorModeContext } from "../../contexts/color-mode";
import { GrafanaService } from "../../services/GrafanaService";
import { grafanaConfig } from "../../config";
import { IGrafanaOrg, IGrafanaDashboard } from "../../interfaces";
import { RESOURCES } from "../../constants";
import { useAuthelia } from "../../hooks/useAuthelia";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [dashboards, setDashboards] = useState<IGrafanaDashboard[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { mutate: logout } = useLogout();
  const { token } = theme.useToken();
  const { mode, setMode } = useContext(ColorModeContext);
  const [organizations, setOrganizations] = useState<IGrafanaOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const grafanaService = new GrafanaService(grafanaConfig);
  const { user, isAdmin } = useAuthelia();

  const handleLogout = async () => {
    try {
      await auth.signoutRedirect();
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await grafanaService.getOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchOrganizations();
    }
  }, [isAdmin]);

  // const { data: customerData, isLoading } = useList<IGrafanaOrg>({
  //   resource: RESOURCES.CUSTOMERS,
  // });

  // console.log("customerData", customerData);

  const handleCustomerSelect = (customerId: number | undefined) => {
    setSelectedCustomerId(customerId);
    
    // Update navigation based on current path
    const currentPath = location.pathname;
    if (currentPath.includes('/alerts/')) {
      navigate(`/alerts/${customerId}/active`);
    } else if (currentPath.includes('/dashboards/')) {
      navigate(`/dashboards/${customerId}`);
    } 
  };

  const getSelectedKeys = () => {
    const pathname = location.pathname;
    if (pathname === '/') return ['overview'];
    
    // For dashboard items
    if (pathname.startsWith('/dashboards/')) {
      if (pathname.includes('/overview')) return ['dashboards-overview'];
      if (pathname.includes('/performance')) return ['dashboards-performance'];
      return ['dashboards'];
    }
    
    // For alert items
    if (pathname.startsWith('/alerts/')) {
      if (pathname.includes('/active')) return ['alerts-active'];
      if (pathname.includes('/history')) return ['alerts-history'];
      return ['alerts'];
    }
    
    // For admin items
    if (pathname.startsWith('/admin/')) {
      const adminPath = pathname.split('/').pop();
      return [adminPath || ''];
    }

    return [pathname.split('/')[1]];
  };

  const getCurrentCustomerName = () => {
    if (!selectedCustomerId || !organizations) return "Select Customer";
    const org = organizations.find(o => o.id === selectedCustomerId);
    return org?.name || "Select Customer";
  };
  // console.log("isAdmin", isAdmin, "selectedCustomerId", selectedCustomerId);
  const menuItems = [
    {
      key: "overview",
      icon: <HomeOutlined />,
      label: "Overview",
      onClick: () => navigate("/"),
    },
    // Customer selector for admin users
    ...(isAdmin ? [{
      key: "customer-selector",
      icon: <TeamOutlined />,
      label: getCurrentCustomerName(),
      children: organizations?.map(org => ({
        key: org.id.toString(),
        label: org.name,
        onClick: () => setSelectedCustomerId(org.id),
      })),
    }] : []),
    // Alerts menu item
    {
      key: "alerts",
      icon: <AlertOutlined />,
      label: "Alerts",
      disabled: isAdmin && selectedCustomerId === undefined,
      onClick: () => {
        onCollapse(true);
        if (isAdmin && selectedCustomerId) {
          navigate(`/alerts/${selectedCustomerId}/active`);
        } else {
          navigate('/alerts');
        }
      },
    },
    // Dashboards menu item
    {
      key: "dashboards",
      icon: <DashboardOutlined />,
      label: "Dashboards",
      disabled: isAdmin && selectedCustomerId === undefined,
      onClick: () => {
        onCollapse(true);
        if (isAdmin && selectedCustomerId) {
          navigate(`/dashboards/${selectedCustomerId}`);
        } else {
          navigate('/dashboards');
        }
      },
    },
    // Admin section
    ...(isAdmin ? [
      {
        key: "admin",
        icon: <SettingOutlined />,
        label: "Admin",
        children: [
          {
            key: "customers",
            label: "Customers",
            icon: <TeamOutlined />,
            onClick: () => navigate("/admin/customers"),
          },
        ],
      },
    ] : []),
  ];

  const getProfileMenuItems = () => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: user?.username || 'Profile',
      style: { width: '100%' },
      children: [
        {
          key: 'theme',
          icon: mode === 'light' ? <BulbOutlined /> : <BulbFilled />,
          label: `${mode === 'light' ? 'Dark' : 'Light'} mode`,
          onClick: () => setMode(mode === 'light' ? 'dark' : 'light'),
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogout,
          // style: { marginBottom: collapsed ? 0 : 8 }
        }
      ],
    },
  ];

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="md"
      trigger={window.innerWidth < 768 ? null : undefined}
      collapsedWidth={window.innerWidth < 768 ? 0 : 50}
      // style={{
      //   position: 'relative',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   ['@media screen and (maxWidth: 768px)' as string]: {
      //     position: 'fixed',
      //     // left: collapsed ? -200 : 40,
      //     zIndex: 999,
      //   },
      // }}
    >
      <Flex vertical align="center" gap="middle" >
        {collapsed ? 
        <Logo type="smplwise-icon" color={token.colorPrimary} style={{width: 'auto', height: 38}} /> : 
        <Logo type="smplwise" color={token.colorPrimary} style={{width: 'auto', height: 38}} />}
      </Flex>

      <Menu
        theme="dark"
        selectedKeys={getSelectedKeys()}
        items={menuItems as ItemType<MenuItemType>[]}
        mode="vertical"
        triggerSubMenuAction="click"
        style={{ flex: 1 }}
      />

      <Menu
        theme="dark"
        mode="vertical"
        selectable={false}
        style={{ borderTop: `1px solid ${token.colorBgContainer}` }}
        triggerSubMenuAction="click"
        items={getProfileMenuItems()}
      />

      <Button
        type="text"
        icon={collapsed ? 
          <MenuUnfoldOutlined style={{ fontSize: '28px', color: token.colorPrimary }} /> : 
          <MenuFoldOutlined style={{ fontSize: '28px', color: token.colorPrimary }} />
        }
        onClick={() => onCollapse(!collapsed)}
        style={{
          position: 'fixed',
          top: 2,
          // left: collapsed ? 4 : 200,
          zIndex: 1000,
          display: window.innerWidth < 768 ? 'block' : 'none',
          border: 'none',
          borderRadius: '4px',
        }}
      />
    </Layout.Sider>
  );
};
