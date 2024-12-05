import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { User } from 'oidc-client-ts';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  orgId?: number;
}

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor
  instance.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
    // Ensure headers is an AxiosHeaders instance
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    // Add Grafana org header if specified
    if (config.orgId) {
      config.headers.set('X-Grafana-Org-Id', config.orgId.toString());
    }

    return config;
  });

  return instance;
}; 