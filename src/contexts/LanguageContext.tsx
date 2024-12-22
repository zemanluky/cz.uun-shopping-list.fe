import * as React from 'react';
import {createContext, useContext, useEffect, useState} from "react";
import {getPreferredLanguage, setPreferredLanguage} from "@Utils/local-storage.utils.ts";

export enum ELanguage {
    Czech = "cs",
    English = "en"
}

interface ILanguageContext {
    /**
     * Current application language.
     */
    language: ELanguage;

    /**
     * Sets the preferred application language.
     * @param lang
     */
    setLanguage: (lang: ELanguage) => void;
}

const LanguageContext = createContext<ILanguageContext|undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [language, setLanguage] = useState<ELanguage>(ELanguage.Czech);

    // load the last setting from local storage, if exists
    useEffect(() => {
        const preferredLanguage = getPreferredLanguage();

        if (preferredLanguage) {
            setLanguage(preferredLanguage);
            return;
        }

        const [lang] = navigator.language.toLowerCase().split('-');

        switch (lang) {
            case 'cs':
                setLanguage(ELanguage.Czech);
                break;
            case 'en':
                setLanguage(ELanguage.English);
                break;
            default:
                setLanguage(ELanguage.Czech);
                break;
        }
    }, []);

    // save the updated language setting to local storage
    useEffect(() => setPreferredLanguage(language), [language]);

    return <LanguageContext.Provider value={{language, setLanguage}}>
        {children}
    </LanguageContext.Provider>;
};

export const useLanguage = (): ILanguageContext => {
    const ctx = useContext(LanguageContext);

    if (!ctx)
        throw new Error(
            "The 'useLanguage' hook may only be used in components wrapped inside the LanguageProvider. " +
            "Please, ensure your component is inside the provider."
        );

    return ctx;
}