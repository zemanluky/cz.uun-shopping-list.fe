import * as React from 'react';
import {createContext, useContext, useEffect, useState} from "react";
import {getPreferredLanguage, setPreferredLanguage} from "@Utils/local-storage.utils.ts";
import { useTranslation } from 'react-i18next';

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

    /**
     * Indicates the language set is being loaded or changed.
     */
    isLoading: boolean;
}

const LanguageContext = createContext<ILanguageContext|undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [language, setLanguage] = useState<ELanguage|null>(null);
    const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
    const { i18n: { changeLanguage }, ready } = useTranslation(['common', 'shopping-list']);

    // load the last setting from local storage, if exists
    useEffect(() => {
        const preferredLanguage = getPreferredLanguage();

        console.log(preferredLanguage);

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

    // save the updated language setting to local storage and update the language on i18n instance
    useEffect(() => {
        if (language) {
            setIsChangingLanguage(true);
            setPreferredLanguage(language);
            changeLanguage(language).then(() => setIsChangingLanguage(false));
        }
    }, [language]);

    return <LanguageContext.Provider value={{
        isLoading: !ready || isChangingLanguage || language === null,
        language: language ?? ELanguage.Czech,
        setLanguage
    }}>
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