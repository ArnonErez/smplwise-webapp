import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export const SilentCallback: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    // Log for debugging
    console.log("Silent callback processing:", {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: auth.error
    });
  }, [auth.isAuthenticated, auth.isLoading, auth.error]);

  // Return null as this component should be invisible
  return null;
}; 