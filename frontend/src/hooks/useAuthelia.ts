import { useAuth } from 'react-oidc-context';

interface AutheliaUser {
    username: string;
    displayName?: string;
    email?: string;
    groups: string[];
}

interface UseAutheliaReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: Error;
    user: AutheliaUser | null;
    isAdmin: boolean;
    hasGroup: (group: string) => boolean;
}

export const useAuthelia = (): UseAutheliaReturn => {
    const auth = useAuth();

    const user: AutheliaUser | null = auth.user ? {
        username: auth.user.profile.preferred_username || auth.user.profile.sub,
        displayName: auth.user.profile.name,
        email: auth.user.profile.email,
        groups: auth.user.profile.groups as string[] || [],
    } : null;

    const isAdmin = Boolean(user?.groups.includes('admin'));

    const hasGroup = (group: string): boolean => {
        return Boolean(user?.groups.includes(group));
    };

    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        user,
        isAdmin,
        hasGroup,
    };
}; 