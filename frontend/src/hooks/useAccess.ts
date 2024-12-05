import { useAuth } from 'react-oidc-context';
import { useGetIdentity } from "@refinedev/core";
import { IUserSession } from "../interfaces";

export const useAccess = () => {
    const auth = useAuth();
    const { data: session } = useGetIdentity<IUserSession>();

    console.log("session", session);
    console.log("authelia", session?.authelia);
    console.log("grafana", session?.grafana);
    
    return {
        // Basic authentication state from OIDC
        isAuthenticated: auth.isAuthenticated && !!session,
        
        // Application-specific permissions
        isAdmin: session?.isAdmin,
        orgId: session?.grafana?.orgId,
        
        // Custom permission checks
        canAccessOrg: (targetOrgId: number) => {
            return session?.isAdmin || session?.grafana?.orgId === targetOrgId;
        },

        // Access to OIDC user info
        user: auth.user,
        
        // Access to application-specific user info
        session: session,
    };
};
