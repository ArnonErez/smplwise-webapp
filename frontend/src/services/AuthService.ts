import { User } from 'oidc-client-ts';
import { IAutheliaProfile, IGrafanaProfile } from '../auth/types/auth.types';

interface ISessionProfile {
    authelia: IAutheliaProfile;
    grafana?: IGrafanaProfile;
}

export class AuthService {
    private static instance: AuthService;
    private session: ISessionProfile | null = null;

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async initializeSession(oidcUser: User): Promise<ISessionProfile> {
        console.log("=== Initialize Session Start ===");
        console.log("Raw OIDC User:", oidcUser);
        console.log("OIDC Profile:", oidcUser.profile);

        try {
            // Extract Authelia profile from OIDC user
            const autheliaProfile: IAutheliaProfile = {
                username: oidcUser.profile.preferred_username || oidcUser.profile.sub,
                display_name: oidcUser.profile.name,
                email: oidcUser.profile.email,
                groups: oidcUser.profile.groups as string[] || [] as string[],
            };
            console.log("Extracted Authelia Profile:", autheliaProfile);

            // Initialize Grafana session
            let grafanaProfile: IGrafanaProfile | undefined;
            try {
                console.log("Attempting to get Grafana user info...");
                // First try to get user info
                let grafanaResponse = await fetch('/grafana/api/user', {
                    credentials: 'include',
                });
                console.log("Initial Grafana Response:", {
                    ok: grafanaResponse.ok,
                    status: grafanaResponse.status,
                });

                if (!grafanaResponse.ok) {
                    console.log("Initial Grafana request failed, attempting session initialization...");
                    // If failed, try to initialize the session
                    grafanaResponse = await fetch('/grafana/api/auth/keys', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: 'browser-session',
                            role: 'Viewer',
                            secondsToLive: 86400
                        })
                    });
                    console.log("Session Init Response:", {
                        ok: grafanaResponse.ok,
                        status: grafanaResponse.status,
                    });

                    if (grafanaResponse.ok) {
                        console.log("Session initialized, retrying user info...");
                        // Try getting user info again
                        grafanaResponse = await fetch('/grafana/api/user', {
                            credentials: 'include'
                        });
                        console.log("Retry User Info Response:", {
                            ok: grafanaResponse.ok,
                            status: grafanaResponse.status,
                        });
                    }
                }

                if (grafanaResponse.ok) {
                    const grafanaUser = await grafanaResponse.json();
                    console.log("Grafana User Data:", grafanaUser);
                    
                    grafanaProfile = {
                        orgId: grafanaUser.orgId,
                        isAdmin: grafanaUser.isGrafanaAdmin,
                        login: grafanaUser.login,
                    };
                    console.log("Extracted Grafana Profile:", grafanaProfile);
                } else {
                    console.warn("Failed to get Grafana user info after all attempts");
                }
            } catch (error: any) {
                console.error('Failed to get Grafana user info:', error);
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }

            // Create and store session
            this.session = {
                authelia: autheliaProfile,
                grafana: grafanaProfile,
            };
            console.log("=== Final Session State ===", this.session);

            return this.session;
        } catch (error: any) {
            console.error('Failed to initialize session:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            } else {
                console.error('Unknown error type:', error);
            }
            console.log("=== Initialize Session Failed ===");
            throw error;
        }
    }

    getSession(): ISessionProfile | null {
        return this.session;
    }

    clearSession(): void {
        this.session = null;
    }
} 