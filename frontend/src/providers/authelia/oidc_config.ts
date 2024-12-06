import { WebStorageStateStore } from "oidc-client-ts";

export const oidcConfig = {
    authority: import.meta.env.VITE_AUTH_URL,
    client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
    client_secret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
    redirect_uri: `${import.meta.env.VITE_APP_URL}/callback`,
    scope: "openid profile email groups",
    // client_authentication: "client_secret_post",
    loadUserInfo: true,
    post_logout_redirect_uri: `${import.meta.env.VITE_APP_URL}`,
    revoke_tokens_on_signout: true,
    omit_scopes_when_requesting: true,
    // automaticSilentRenew: true,
    monitorSession: true,
    // silent_redirect_uri: `${import.meta.env.VITE_APP_URL}/silent-callback`,
    silentRequestTimeout: 10000,

    // State management updates
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
    // Additional recommended settings
    userStore: new WebStorageStateStore({ store: window.sessionStorage })
    // onSigninCallback: (_user: any) => {
    //     console.log("onSigninCallback", _user);
    //     // Clean up old tokens
    //     const keysToRemove = Object.keys(localStorage)
    //         .filter(key => key.startsWith('oidc.'));
    //     keysToRemove.forEach(key => localStorage.removeItem(key));
        
    //     window.history.replaceState({}, document.title, '/');
    // },
    // stateStore: {
    //     set: (key: string, value: string) => {
    //         // Prevent duplicate states
    //         localStorage.setItem(key, value);
    //     },
    //     get: (key: string) => {
    //         return localStorage.getItem(key);
    //     },
    //     remove: (key: string) => {
    //         localStorage.removeItem(key);
    //     }
    // }
};