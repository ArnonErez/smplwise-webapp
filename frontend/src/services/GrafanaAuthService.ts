import { createAxiosInstance } from '../lib/http-client';
import { grafanaConfig } from '../config';

class GrafanaAuthService {
  private static instance: GrafanaAuthService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GrafanaAuthService {
    if (!GrafanaAuthService.instance) {
      GrafanaAuthService.instance = new GrafanaAuthService();
    }
    return GrafanaAuthService.instance;
  }

  async initialize(token: string): Promise<void> {
    if (this.isInitialized) return;

    const http = createAxiosInstance(grafanaConfig.baseUrl);
    try {
      console.log('Initializing Grafana OAuth session');
      const response = await http.get('/login/generic_oauth', {
        // headers: {
        // //   Authorization: `Bearer ${token}`,
        //   'content-type': 'application/json'
        // },
        withCredentials: true,
        maxRedirects: 1,
        validateStatus: (status) => status === 200 || status === 302 || status === 307
      });
      console.log("Grafana response", response);

      if (response.status === 200 || response.status === 302 || response.status === 307) {
        // console.log("Grafana session initialized");
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize Grafana session:', error);
      throw error;
    }
  }
}

export const grafanaAuth = GrafanaAuthService.getInstance(); 