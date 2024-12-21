import {TUser} from "../types/user.ts";

/**
 * Gets full name of a given user.
 * @param user
 */
export function fullName(user: TUser): string {
    return `${user.name} ${user.surname}`;
}

/**
 * Gets initials of a given user.
 * @param user
 */
export function getInitials(user: TUser): string {
    const parts = fullName(user).split(' ');

    return parts.reduce((acc, curr, idx) => {
        if (idx === 0 || idx === parts.length - 1)
            acc = `${acc}${curr[0].toUpperCase()}`;
        return acc;
    }, '');
}