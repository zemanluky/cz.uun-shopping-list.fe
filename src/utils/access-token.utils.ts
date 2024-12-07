export const ACCESS_TOKEN_STORAGE_KEY: string = "auth_token";

/**
 * Saves new access token to local storage.
 * @param accessToken
 */
export function saveAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

/**
 * Gets the access token from local storage.
 */
export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * Remove the access token from local storage.
 */
export function deleteAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}