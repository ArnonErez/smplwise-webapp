import { Avatar, Typography, Dropdown, theme, Layout, Flex } from "antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { BulbFilled, BulbOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Logo } from "../Logo";
import { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;

export const Header: React.FC = () => {
  const { token } = theme.useToken();
  const { data: user } = useGetIdentity<{ name: string }>();
  const { mutate: logout } = useLogout();
  const { mode, setMode } = useContext(ColorModeContext);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase() || '';
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'theme',
      icon: mode === 'light' ? <BulbOutlined /> : <BulbFilled />,
      label: `Switch to ${mode === 'light' ? 'dark' : 'light'} mode`,
      onClick: () => setMode(mode === 'light' ? 'dark' : 'light'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => logout(),
    },
  ];

  return (
    <Layout.Header
      style={{
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Flex 
        align="center" 
        justify="space-between" 
        style={{ width: '100%' }}
      >
        {/* <Flex align="center" gap="middle">
          <Logo type="smplwise" color="white" style={{width: 'auto', height: 40}} />
          <Logo type="partner" style={{width: 'auto', height: 40, maxWidth: '100%'}}/>
        </Flex> */}

        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <div 
            className="user-dropdown-trigger" 
            style={{ 
              cursor: 'pointer', 
              padding: '0 12px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            {user?.name ? (
              <Avatar
                style={{
                  backgroundColor: "white",
                  color: token.colorPrimary,
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            <Text>
              {user?.name}
            </Text>
          </div>
        </Dropdown>
      </Flex>
    </Layout.Header>
  );
};
