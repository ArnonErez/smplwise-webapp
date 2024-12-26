import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createAxiosInstance } from '../lib/http-client';
import { GrafanaConfig } from '../config';
import { 
  IGrafanaOrg, 
  IGrafanaOrgCreate, 
  IGrafanaUserCreate,
  IGrafanaOrgUser,
  IGrafanaDashboard,
  IGrafanaFolder,
  IGrafanaOrgUpdate
} from '../interfaces';
import { useAuth } from 'react-oidc-context';
// Extend AxiosRequestConfig to include orgId
interface GrafanaRequestConfig extends AxiosRequestConfig {
  orgId?: number;
}

export class GrafanaService {
  private readonly http: AxiosInstance;

  constructor(config: GrafanaConfig) {
    this.http = createAxiosInstance(config.baseUrl);
  }

  async getOrganizations(): Promise<IGrafanaOrg[]> {
    try {
      console.log("getOrganizations");
      const response = await this.http.get('/api/orgs');
      console.log("Organizations response", response);
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw this.handleError(error);
    }
  }

  async getUserOrganizations(): Promise<IGrafanaOrg[]> {
    try {
      console.log("getUserOrganizations");
      const response = await this.http.get('/api/user/orgs');
      console.log("User Organizations response", response);
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw this.handleError(error);
    }
  }

  // Organization Management
  async createOrganization(data: IGrafanaOrgCreate): Promise<IGrafanaOrg> {
    try {
      const response = await this.http.post('/api/orgs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw this.handleError(error);
    }
  }

  async updateOrganization(orgId: number, data: IGrafanaOrgUpdate): Promise<IGrafanaOrg> {
    try {
      const response = await this.http.put(`/api/orgs/${orgId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw this.handleError(error);
    }
  }

  async deleteOrganization(orgId: number): Promise<void> {
    try {
      await this.http.delete(`/api/orgs/${orgId}`);
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw this.handleError(error);
    }
  }

  async removeUserFromOrganization(orgId: number, userId: number): Promise<void> {
    try {
      await this.http.delete(`/api/orgs/${orgId}/users/${userId}`);
    } catch (error) {
      console.error('Error removing user from organization:', error);
      throw this.handleError(error);
    }
  }

  async getOrganization(orgId: number): Promise<IGrafanaOrg> {
    try {
      const response = await this.http.get(`/api/orgs/${orgId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw this.handleError(error);
    }
  }

  // User Management
  async addUserToOrganization(
    orgId: number,
    data: IGrafanaUserCreate
  ): Promise<IGrafanaOrgUser> {
    const config: GrafanaRequestConfig = {
      orgId
    };

    const response = await this.http.post(
      `/api/orgs/${orgId}/users`, 
      {
        loginOrEmail: data.email,
        role: data.role
      },
      config
    );
    return response.data;
  }

  async getOrganizationUsers(orgId: number): Promise<IGrafanaOrgUser[]> {   
    try {
      const response = await this.http.get(`/api/orgs/${orgId}/users` );
      return response.data;
    } catch (error) {
      console.error('Error fetching organization users:', error);
      throw this.handleError(error);
    }
  }

//   private async getFolders(orgId: number, parentUid?: string): Promise<IGrafanaFolder[]> {
//     const config: GrafanaRequestConfig = {
//       params: { type: 'dash-folder', parentUid: parentUid || '' },
//       orgId
//     };

//     try {
//       const response = await this.http.get('/api/search', config);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching folders:', error);
//       throw this.handleError(error);
//     }
//   }

  // If folderUid is provided, get the hierarchy of the provided folder.
  // Otherwise, get the complete folder hierarchy.
  async getFolderHierarchy(orgId: number, folderUid?: string): Promise<IGrafanaFolder[]> {
    const config: GrafanaRequestConfig = { orgId, params: folderUid ? { parentUid: folderUid } : {} };
    try {
        // Get all subfolders of the current folder (all main ones if folderUid is not provided)
        const response = await this.http.get('/api/folders', config);
        const folders: IGrafanaFolder[] = response.data;

        const foldersWithChildren = await Promise.all(
            folders.map(async (folder: any) => {
                const subFolders = await this.getFolderHierarchy(orgId, folder.uid);
                return { 
                    ...folder, 
                    children: subFolders.length > 0 ? subFolders : undefined 
                };
            })
        );

      return foldersWithChildren;
    } catch (error) {
      console.error('Error fetching folder hierarchy:', error);
      throw this.handleError(error);
    }
  }

  async getDashboards(orgId: number, searchQuery?: string, limit?: number): Promise<IGrafanaDashboard[]> {
    const config: GrafanaRequestConfig = {
      params: { type: 'dash-db', query: searchQuery, limit: limit },
      orgId
    };

    try {
      const response = await this.http.get('/api/search', config);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      throw this.handleError(error);
    }
  }

  async getDashboard(orgId: number, uid: string): Promise<any> {
    const config: GrafanaRequestConfig = { orgId };
    try {
      const response = await this.http.get(`/api/dashboards/uid/${uid}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw this.handleError(error);
    }
  }

  async getDashboardPanels(orgId: number, uid: string): Promise<any> {
    const dashboard = await this.getDashboard(orgId, uid);
    return dashboard.dashboard.panels || [];
  }

  // Error handling utility
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw new Error(`Grafana API error: ${error.response?.data?.message || error.message}`);
    }
    throw error as Error;
  }
} 