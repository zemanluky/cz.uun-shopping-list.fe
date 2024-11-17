import i18next from "i18next";
import translation from "zod-i18n-map/locales/cs/zod.json"
import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";

i18next.init({
    lng: "cs",
    resources: {
        cs: { zod: translation },
    },
});

z.setErrorMap(zodI18nMap);

export { z };