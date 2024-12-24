// import generated interface
import Resources from "./i18-resources";

declare module "i18next" {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        // custom namespace type, if you changed it
        defaultNS: "common";
        // custom resources type
        resources: Resources
    }
}
