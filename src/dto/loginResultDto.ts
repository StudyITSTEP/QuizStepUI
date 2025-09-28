export interface LoginResultDto {
    accessToken?: string | null;
    token: string;
    refreshToken?: string | null;
}