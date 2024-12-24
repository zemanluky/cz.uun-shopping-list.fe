import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";

// i18next.init({
//     lng: "cs",
//     resources: {
//         cs: { zod: translation },
//     },
// });

z.setErrorMap(zodI18nMap);

export { z };

export function transformToNull<T extends any>(value: T|null): T|null {
    return !!value ? value : null;
}