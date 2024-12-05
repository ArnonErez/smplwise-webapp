import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spin } from "antd";
import { grafanaAuth } from '../../services/GrafanaAuthService';

export const AuthCallback: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  console.log("auth", auth);

  useEffect(() => {
    if (auth.user?.access_token) {
      // Initialize Grafana session
      grafanaAuth.initialize(auth.user.access_token)
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to initialize Grafana:', error);
          // Handle error appropriately
        });
    }
  }, [auth.user]);

  // navigate('/');

  return <div>Completing authentication...</div>;
};