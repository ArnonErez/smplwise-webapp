import { WebStorageStateStore } from "oidc-client-ts";

// const app_url = import.meta.env.VITE_APP_URL || "https://smplwise.com";
// const auth_url = import.meta.env.VITE_AUTH_URL || "https://smplwise.com/auth";
// const auth_client_id = import.meta.env.VITE_AUTH_CLIENT_ID || "frontend";
// const auth_client_secret = import.meta.env.VITE_AUTH_CLIENT_SECRET || "QN_EVekFgTEQPhuLNNnY9JbnnIjxP4nha9BiypIu6M9qrHVw6jfLvd~rPCcnneDzdP2QZoC3";
// const auth_redirect_uri = import.meta.env.VITE_AUTH_REDIRECT_URI || "https://smplwise.com/callback";

const currentHost = window.location.origin;

const app_url = currentHost;
const auth_url = `${currentHost}/auth`;
const auth_client_id = "frontend";
const auth_client_secret = "QN_EVekFgTEQPhuLNNnY9JbnnIjxP4nha9BiypIu6M9qrHVw6jfLvd~rPCcnneDzdP2QZoC3";
const auth_redirect_uri = `${currentHost}/callback`;

export const oidcConfig = {
    authority: auth_url,
    client_id: auth_client_id,
    client_secret: auth_client_secret,
    redirect_uri: `${auth_redirect_uri}`,
    scope: "openid profile email groups",
    // client_authentication: "client_secret_post",
    loadUserInfo: true,
    post_logout_redirect_uri: `${app_url}`,
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