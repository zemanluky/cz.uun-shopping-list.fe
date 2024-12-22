import {EThemeOption} from "../contexts/ThemeContext.tsx";
import {ELanguage} from "../contexts/LanguageContext.tsx";

export const ACCESS_TOKEN_STORAGE_KEY: string = "auth_token";
export const THEME_STORAGE_KEY: string = "preferred_theme";
export const LANGUAGE_STORAGE_KEY: string = "app_lang";

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

/**
 * Sets the preferred language.
 * @param lang
 */
export function setPreferredLanguage(lang: ELanguage): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

/**
 * Gets the preferred language.
 * @returns The preferred language or null when not yet set.
 */
export function getPreferredLanguage(): ELanguage|null {
    const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return lang as ELanguage|null;
}