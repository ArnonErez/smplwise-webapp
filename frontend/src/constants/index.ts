export const RESOURCES = {
  CUSTOMERS: "organizations",
} as const;

export const CUSTOMER_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
} as const;

export const CUSTOMER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const GRAFANA_DASHBOARDS = {
  ALERT_HISTORY: 'alert-history',
  ACTIVE_ALERTS: 'all-active-alerts',
} as const;
