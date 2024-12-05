export interface IAutheliaUser {
    profile: {
        username: string;
        display_name: string;
    };
    email: string;
    groups: string[];
    // authentication_level: number; // 0 = anonymous, 1 = 1FA, 2 = 2FA
}

// You can also add an enum for authentication levels if needed
export enum AutheliaAuthLevel {
    Anonymous = 0,
    OneFactor = 1,
    TwoFactor = 2
} 