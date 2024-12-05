import { useAuth } from 'react-oidc-context';
import { AuthService } from '../services/AuthService';

interface GrafanaUser {
    orgId: number;
    isAdmin?: boolean;
    login?: string;
}

interface UseGrafanaReturn {
    isLoading: boolean;
    error?: Error;
    user: GrafanaUser | null;
    refreshSession: () => Promise<void>;
    // canAccessOrg: (orgId: number) => boolean;
}

export const useGrafana = (): UseGrafanaReturn => {
    const auth = useAuth();
    const authService = AuthService.getInstance();

    const user = authService.getSession()?.grafana || null;

    const refreshSession = async () => {
        if (auth.user) {
            await authService.initializeSession(auth.user);
        }
    };

    // const canAccessOrg = (orgId: number): boolean => {
    //     if (auth.user?.profile.groups?.includes('admins')) return true;
    //     return user?.orgId === orgId;
    // };

    return {
        isLoading: auth.isLoading,
        error: auth.error,
        user,
        refreshSession,
        // canAccessOrg,
    };
}; 