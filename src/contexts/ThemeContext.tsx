import * as React from 'react';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {getPreferredTheme, setPreferredTheme} from "@Utils/local-storage.utils.ts";

export enum ETheme {
    Light = 'light',
    Dark = 'dark'
}

interface IThemeContext {
    /** The set theme. */
    theme: ETheme,

    /**
     * Method to set the theme preference.
     * @param theme Provide the desired theme or null to use the system default.
     */
    setThemePreference: (theme: ETheme|null) => void
}

const ThemeContext = createContext<IThemeContext|undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState<ETheme|null>(null);

    // load the last setting from local storage, if exists
    useEffect(() => setTheme(getPreferredTheme()), []);

    // save the theme setting to local storage
    useEffect(() => setPreferredTheme(theme), [theme]);

    // The actual theme based on the system setting or the preference
    const currentTheme = useMemo<ETheme>(() => {
        if (theme !== null) return theme;

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ETheme.Dark
            : ETheme.Light
            ;
    }, [theme]);

    // update the theme when the preference changes
    useEffect(() => {
        if (currentTheme === ETheme.Light) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            return;
        }

        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }, [theme]);

    return <ThemeContext.Provider value={{ theme: currentTheme, setThemePreference: setTheme }}>
        {children}
    </ThemeContext.Provider>;
};

/**
 * Hook to access the theme context.
 */
export const useTheme = (): IThemeContext => {
    const ctx = useContext(ThemeContext);

    if (!ctx)
        throw new Error(
            "The 'useTheme' hook may only be used in components wrapped inside the ThemeProvider. " +
            "Please, ensure your component is inside the provider."
        );

    return ctx;
}