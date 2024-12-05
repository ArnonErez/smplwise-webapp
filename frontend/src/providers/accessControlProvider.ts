import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // Get user from params
    const user = params?.user;

    // Admin can do everything
    if (user?.labels?.includes('admin')) {
      return { can: true };
    }

    // For admin-only resources
    if (resource === "configurations" || 
        resource === "customers") {
      return {
        can: false,
        reason: "Only administrators can access this resource"
      };
    }

    // For alerts, check if user has access to the specific customer
    if (resource === "alerts" && action === "show") {
      const customerId = params?.id;
      // Allow if it's the user's own customer or if they're NOC
      if (user?.clientId === customerId || user?.labels?.includes('noc')) {
        return { can: true };
      }
      return {
        can: false,
        reason: "You can only view alerts for your own customer"
      };
    }

    // Default allow for other resources
    return { can: true };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  }
}; 