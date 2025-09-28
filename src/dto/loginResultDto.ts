export interface LoginResultDto {
    token: string;
    refreshToken?: string | null;
}