import {TUser} from "../types/user.ts";

/**
 * Gets full name of a given user.
 * @param user
 */
export function fullName(user: TUser): string {
    return `${user.name} ${user.surname}`;
}