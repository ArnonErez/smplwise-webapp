import { AuthBindings, AuthProvider } from "@refinedev/core";
import { User } from "oidc-client-ts";
import { useAuth } from "react-oidc-context";

// The auth provider should be thin, mostly delegating to react-oidc-context
export const authProvider: AuthProvider = {
    login: async () => {
      const auth = useAuth();
      await auth.signinRedirect();
      return {
        success: true
      };
    },
    
    logout: async () => {
      const auth = useAuth();
      auth.removeUser();
      await auth.signoutRedirect();
      return {
        success: true
      };
    },
    
    check: async () => {
      const auth = useAuth();
      return auth.isAuthenticated ? {
        authenticated: true
      } : {
        authenticated: false,
        logout: true,
        redirectTo: "/login"
      };
    },
    
    getPermissions: async () => {
      const auth = useAuth();
      const isAdmin = auth.user?.profile.groups?.toString().includes('admins');
      return isAdmin ? 'admin' : 'user';
    },
    
    getIdentity: async () => {
      const auth = useAuth();
      return auth.user;
    },

    onError: async (error) => {
      console.error('Auth Error:', error);
      return { error };
    }
  };
// const OIDC_STORAGE_KEY = `oidc.user:${import.meta.env.VITE_AUTH_URL}:${import.meta.env.VITE_AUTH_CLIENT_ID}`;

// function getUser(): User | null {
//     console.log('OIDC_STORAGE_KEY:', OIDC_STORAGE_KEY);
    
//     // Log all localStorage keys to see what's actually there
//     console.log('All localStorage keys:', Object.keys(localStorage));
    
//     const oidcStorage = sessionStorage.getItem(OIDC_STORAGE_KEY);
//     console.log('oidcStorage value:', oidcStorage);
    
//     if (!oidcStorage) {
//         return null;
//     }

//     try {
//         const user = User.fromStorageString(oidcStorage);
//         console.log('Parsed user:', user);
//         return user;
//     } catch (error) {
//         console.error('Error parsing user from storage:', error);
//         return null;
//     }
// }

// export const authProvider: AuthProvider = {
//     login: async () => {
//         return {
//             success: true,
//         };
//     },

//     logout: async () => {
//         console.log('logging out...');
//         const auth = useAuth();
//         if (auth) {
            
//             // localStorage.clear();
//             // sessionStorage.clear();
//             auth.removeUser();
//             auth.signoutRedirect();
//         }
        
//         return {
//             success: true,
//         };
//     },

//     check: async () => {
//         const user = getUser();
//         return {
//             authenticated: !!user && !user.expired,
//         };
//     },

//     getIdentity: async () => {
//         const user = getUser();
//         if (!user || user.expired) return null;

//         return {
//             id: user.profile.sub,
//             name: user.profile.name,
//             email: user.profile.email,
//             groups: user.profile.groups,
//         };
//     },

//     getPermissions: async () => {
//         const user = getUser();
//         return user?.profile.groups ?? [];
//     },

//     onError: async (error) => {
//         console.error('Auth Error:', error);
//         return { error };
//     },
// };
