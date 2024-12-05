import { ReactNode } from 'react';
import { CUSTOMER_TYPES, CUSTOMER_STATUSES } from '../constants';
import { BaseKey } from '@refinedev/core';
import { IAutheliaUser } from './authelia';

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

export interface IUser {
  $id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  labels: string[];
  customerId?: string;
}

export interface IClient {
  id: string;
  name: string;
}

export interface IDashboard {
  id: string;
  title: string;
  link?: string;
  clientId: {
    $id: string;
    Name: string;
    type: string | null;
    website: string | null;
    'contact-email': string | null;
  } | string;
}

export interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string;
  path?: string;
  children?: boolean;
  secondaryMenuTitle?: string;
}

export interface SidebarProps {
  collapsed: boolean;
  onSecondaryMenuOpen: (menuItem: MenuItem) => void;
  onMenuClick: () => void;
  showSecondaryMenu: boolean;
  activeMenuItem: MenuItem | null;
}

export interface IConfig {
  id: string;
  key: string;
  value: string;
  environment: 'development' | 'production';
  description?: string;
}

export interface ICustomer {
  id: string;
  $id?: string;
  name: string;
  type: keyof typeof CUSTOMER_TYPES;
  status: keyof typeof CUSTOMER_STATUSES;
  contact_email: string;
  phone?: string;
  address?: string;
  website?: string;
  tags?: string[];
  grafana_enabled?: boolean;
  grafana_orgId?: number;
  grafana_orgName?: string;
  grafana_service_token?: string;
}

// Grafana User Interface
export interface IGrafanaUser {
    id: number;
    uid: string;
    email: string;
    name: string;
    login: string;
    theme: string;
    orgId: number;
    isGrafanaAdmin: boolean;
    isDisabled: boolean;
    isExternal: boolean;
    authLabels: string[];
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}

// Grafana Organization Interface
export interface IGrafanaOrg {
    id: number;
    name: string;
    address: {
        address1: string;
        address2: string;
        city: string;
        zipCode: string;
        state: string;
        country: string;
    };
}

// Grafana Dashboard Interface
export interface IGrafanaDashboard {
    id: number;
    uid: string;
    title: string;
    uri: string;
    url: string;
    slug: string;
    type: string;
    tags: string[];
    isStarred: boolean;
    folderUid?: string;
    folderTitle?: string;
    folderUrl?: string;
}

// Grafana Folder Interface
export interface IGrafanaFolder {
    id: number;
    uid: string;
    title: string;
    url: string;
    hasAcl: boolean;
    canSave: boolean;
    canEdit: boolean;
    canAdmin: boolean;
    version: number;
    children?: IGrafanaFolder[];
}

// Grafana Role Enum
export enum GrafanaRole {
    VIEWER = 'Viewer',
    EDITOR = 'Editor',
    ADMIN = 'Admin'
}

// Grafana User in Organization Interface
export interface IGrafanaOrgUser {
    orgId: number;
    userId: number;
    email: string;
    name: string;
    avatarUrl: string;
    login: string;
    role: GrafanaRole;
    lastSeenAt: string;
    lastSeenAtAge: string;
}

// Add these interfaces if not already present
export interface IGrafanaOrgCreate {
    name: string;
}

export interface IGrafanaOrgUpdate {
    name?: string;
    address?: {
        address1?: string;
        address2?: string;
        city?: string;
        zipCode?: string;
        state?: string;
        country?: string;
    };
}

export interface IGrafanaUserCreate {
    name: string;
    email: string;
    login: string;
    password: string;
    orgId?: number;
    role?: GrafanaRole;
}

export interface IUserSession {
  authelia: IAutheliaUser;
  grafana?: IGrafanaUser;
  isAdmin: boolean;  // Computed from Authelia groups
}

export * from './authelia';