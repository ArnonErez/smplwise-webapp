import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { grafanaAuth } from '../../services/GrafanaAuthService';

export const AuthCallback: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const initializeSession = async () => {
      if (auth.user?.access_token) {
        try {
          await grafanaAuth.initialize(auth.user.access_token);
          localStorage.setItem('lastLogin', new Date().toISOString());
          navigate('/app', { replace: true });
        } catch (error) {
          console.error('Session initialization failed:', error);
          setError('Failed to initialize session');
        }
      }
    };

    initializeSession();
  }, [auth.user]);

  if (error) return <div>Error: {error}</div>;
  return <Spin size="large" tip="Signing you in..." fullscreen />;
};