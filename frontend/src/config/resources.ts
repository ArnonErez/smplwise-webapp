import { 
  HomeOutlined, 
  DashboardOutlined, 
  SettingOutlined, 
  TeamOutlined,
  AlertOutlined 
} from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";
import React from 'react';

export const resources: IResourceItem[] = [
  {
    name: "overview",
    list: "/",
    meta: {
      icon: React.createElement(HomeOutlined),
      label: "Overview",
    }
  },
  {
    name: "alerts",
    list: "/alerts",
    show: "/alerts/:customerId",
    meta: {
      icon: React.createElement(AlertOutlined),
      label: "Alerts",
    }
  },
  {
    name: "dashboards",
    list: "/dashboards",
    show: "/dashboards/:customerId",
    meta: {
      icon: React.createElement(DashboardOutlined),
      label: "Dashboards",
    }
  },
  {
    name: "admin",
    meta: {
      label: "Admin",
      icon: React.createElement(SettingOutlined),
    }
  },
  {
    name: "customers",
    list: "/admin/customers",
    meta: {
      parent: "admin",
      label: "Customers",
      icon: React.createElement(TeamOutlined),
    }
  }
]; 