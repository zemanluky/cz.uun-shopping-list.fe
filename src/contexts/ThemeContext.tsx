import * as React from 'react';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {getPreferredTheme, setPreferredTheme} from "@Utils/local-storage.utils.ts";

export enum ETheme {
    Light = 'light',
    Dark = 'dark'
}

export enum EThemeOption {
    Light = 'light',
    Dark = 'dark',
    System = 'system'
}

interface IThemeContext {
    /** The set preference. */
    themePreference: EThemeOption,

    /** The actual theme. */
    theme: ETheme,

    /**
     * Method to set the theme preference.
     * @param theme Provide the desired theme.
     */
    setThemePreference: (theme: EThemeOption) => void
}

const ThemeContext = createContext<IThemeContext|undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [themePreference, setThemePreference] = useState<EThemeOption>(EThemeOption.System);

    // load the last setting from local storage, if exists
    useEffect(() => setThemePreference(getPreferredTheme()), []);

    // save the theme setting to local storage
    useEffect(() => setPreferredTheme(themePreference), [themePreference]);

    // The actual theme based on the system setting or the preference
    const currentTheme = useMemo<ETheme>(() => {
        switch (themePreference) {
            case EThemeOption.Light:
                return ETheme.Light;

            case EThemeOption.Dark:
                return ETheme.Dark;

            default:
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? ETheme.Dark
                    : ETheme.Light
                ;
        }
    }, [themePreference]);

    // update the theme when the preference changes
    useEffect(() => {
        if (currentTheme === ETheme.Light) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            return;
        }

        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }, [currentTheme]);

    return <ThemeContext.Provider value={{ themePreference, theme: currentTheme, setThemePreference }}>
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