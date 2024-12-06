import React from "react";
import { Button, Flex, Space, Typography } from "antd";
import { useAuth } from "react-oidc-context";

export const Welcome: React.FC = () => {
  const auth = useAuth();
  return (
    <Flex 
      vertical
      align="center" 
      justify="center"
      style={{ width: '100%', height: '100vh' }}
    >
      <div>
        <Typography.Title style={{ color: 'black' }} level={1}>Welcome to SmplWise</Typography.Title>
    </div>
    <div>
      <Button type="primary" onClick={() => auth.signinRedirect()}>Sign in</Button>
      </div>
    </Flex>
  );
};
