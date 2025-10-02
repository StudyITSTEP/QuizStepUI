import type { User } from "../entities/User";

export function isUserInRole(user: User, roles: string[]): boolean {
    if (!user.roles) return false;
    return !!user.roles.find(role => roles.includes(role));
}