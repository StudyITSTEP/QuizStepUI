export type User = {
    sub: string,
    firstName: string,
    lastName: string,
    email: string,
    roles: string[],
    token?: string | null,
    refreshToken?: string | null
    isAuthenticated: boolean,
}