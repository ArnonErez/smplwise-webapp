import { User } from "oidc-client-ts";

export interface IAutheliaProfile {
    username: string;
    display_name?: string;
    groups: string[];
    email?: string;
}

export interface IGrafanaProfile {
    orgId: number;
    isAdmin?: boolean;
    login?: string;
}

export interface IAuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: Error;
    oidcUser?: User;
    profile?: {
        authelia: IAutheliaProfile;
        grafana?: IGrafanaProfile;
    };
}

export interface IAuthContext extends IAuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
} 