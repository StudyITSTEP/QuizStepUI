export type User = {
    firstName: string,
    lastName: string,
    email: string,
    token?: string | null,
    refreshToken?: string | null
}