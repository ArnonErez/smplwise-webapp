import { User } from 'oidc-client-ts';

let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
    currentUser = user;
};

export const getAccessToken = () => {
    return currentUser?.access_token ?? null;
}; 