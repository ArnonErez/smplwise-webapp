import { 
    DataProvider, 
    GetListResponse, 
    BaseRecord, 
    GetListParams,
    GetOneParams,
    GetOneResponse,
    CreateParams,
    CreateResponse,
    UpdateParams,
    UpdateResponse,
    DeleteOneParams,
    DeleteOneResponse,
    CrudFilters,
    CrudFilter
} from "@refinedev/core";
import { GrafanaService } from "../services/GrafanaService";
import { grafanaConfig } from "../config";
import { IGrafanaOrg, IGrafanaOrgUser, GrafanaRole } from "../interfaces";

const grafanaService = new GrafanaService(grafanaConfig);

interface OrganizationCreateVariables {
    name: string;
}

interface OrganizationUpdateVariables {
    name?: string;
}

interface OrganizationUserCreateVariables {
    orgId: number;
    name: string;
    email: string;
    password: string;
    role: GrafanaRole;
}

interface OrganizationUserUpdateVariables {
    orgId: number;
    role: GrafanaRole;
}

interface OrganizationUserDeleteVariables {
    orgId: number;
}

type ResourceTypes = {
    organizations: IGrafanaOrg;
    "organization-users": IGrafanaOrgUser;
};

const getOrgIdFromFilters = (filters?: CrudFilters): number => {
    const orgIdFilter = filters?.find(
        (filter): filter is CrudFilter => 
            'value' in filter && filter.operator === 'eq' && filter.field === 'orgId'
    );
    
    if (!orgIdFilter?.value) {
        throw new Error('orgId filter is required');
    }
    
    return Number(orgIdFilter.value);
};

export const dataProvider: DataProvider = {
    getApiUrl: () => grafanaConfig.baseUrl + '/api',
    getList: async <TData extends BaseRecord = BaseRecord>({ 
        resource, 
        filters,
    }: GetListParams): Promise<GetListResponse<TData>> => {
        switch (resource) {
            case "organizations": {
                const orgs = await grafanaService.getOrganizations();
                return {
                    data: orgs as unknown as TData[],
                    total: orgs.length,
                };
            }

            case "organization-users": {
                const orgId = getOrgIdFromFilters(filters);
                const users = await grafanaService.getOrganizationUsers(orgId);
                return {
                    data: users as unknown as TData[],
                    total: users.length,
                };
            }

            case "dashboards": {
                const orgId = getOrgIdFromFilters(filters);
                const dashboards = await grafanaService.getDashboards(orgId);
                return {
                    data: dashboards as unknown as TData[],
                    total: dashboards.length,
                };
            }

            default:
                throw new Error(`Resource ${resource} not supported`);
        }
    },

    getOne: async <TData extends BaseRecord = BaseRecord>({ 
        resource, 
        id 
    }: GetOneParams): Promise<{ data: TData }> => {
        switch (resource) {
            case "organizations": {
                const org = await grafanaService.getOrganization(Number(id));
                return {
                    data: org as unknown as TData,
                };
            }

            default:
                throw new Error(`Resource ${resource} not supported`);
        }
    },

    create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
        resource,
        variables,
    }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
        switch (resource) {
            case "organizations": {
                const org = await grafanaService.createOrganization(
                    variables as OrganizationCreateVariables
                );
                return {
                    data: org as unknown as TData,
                };
            }

            case "organization-users": {
                const vars = variables as OrganizationUserCreateVariables;
                if (!vars.orgId) {
                    throw new Error('orgId is required');
                }
                const user = await grafanaService.addUserToOrganization(
                    vars.orgId,
                    {
                        name: vars.name,
                        email: vars.email,
                        login: vars.email.split('@')[0],
                        password: vars.password,
                        role: vars.role,
                    }
                );
                return {
                    data: user as unknown as TData,
                };
            }

            default:
                throw new Error(`Resource ${resource} not supported`);
        }
    },

    update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
        resource,
        id,
        variables,
    }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
        switch (resource) {
            case "organizations": {
                const org = await grafanaService.updateOrganization(
                    Number(id),
                    variables as OrganizationUpdateVariables
                );
                return {
                    data: org as unknown as TData,
                };
            }

            default:
                throw new Error(`Resource ${resource} not supported`);
        }
    },

    deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
        resource,
        id,
        variables,
    }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
        switch (resource) {
            case "organizations": {
                await grafanaService.deleteOrganization(Number(id));
                return {
                    data: {} as TData,
                };
            }

            case "organization-users": {
                const vars = variables as OrganizationUserDeleteVariables;
                if (!vars?.orgId) {
                    throw new Error('orgId is required');
                }
                await grafanaService.removeUserFromOrganization(
                    vars.orgId,
                    Number(id)
                );
                return {
                    data: {} as TData,
                };
            }

            default:
                throw new Error(`Resource ${resource} not supported`);
        }
    },
}; 