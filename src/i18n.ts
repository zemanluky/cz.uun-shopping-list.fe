import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend, {HttpBackendOptions} from 'i18next-http-backend';
import {ELanguage} from "./contexts";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
        debug: true,
        defaultNS: 'common',
        supportedLngs: Object.values(ELanguage),
        fallbackLng: ELanguage.Czech,
        lng: ELanguage.Czech,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        }
    });


export default i18n;