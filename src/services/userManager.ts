import type { User } from "../entities/User";

export function isUserInRole(user: User, roles: string[]): boolean {
    if (!user.roles) return false;
    const match = user.roles.filter(r => roles.includes(r));
    return match && match.length > 0;
}