import {ETheme} from "../contexts/ThemeContext.tsx";

export const ACCESS_TOKEN_STORAGE_KEY: string = "auth_token";
export const THEME_STORAGE_KEY: string = "preferred_theme";

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

/**
 * Sets the preferred theme.
 * @param theme
 */
export function setPreferredTheme(theme: ETheme|null): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme ?? 'system');
}

/**
 * Gets the preferred theme.
 * @returns The preferred theme or null if the system default is used.
 */
export function getPreferredTheme(): ETheme|null {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);

    if (theme === 'system') return null;

    return theme as ETheme;
}