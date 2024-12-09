// Types
export interface GrafanaAuthConfig {
    username?: string;
    password?: string;
    apiKey?: string;
}

export interface GrafanaConfig {
    baseUrl: string;
    // auth: GrafanaAuthConfig;
    defaultOrgId?: number;
}

// Configuration
export const grafanaConfig: GrafanaConfig = {
    baseUrl: import.meta.env.VITE_GRAFANA_URL || '/grafana',
    defaultOrgId: Number(import.meta.env.VITE_GRAFANA_DEFAULT_ORG_ID) || 1
};

// // Re-export other constants
// export * from '../constants'; 