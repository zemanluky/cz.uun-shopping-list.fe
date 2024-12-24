import React from "react";
import {VStack} from "../../../../styled-system/jsx";
import {Field} from "@Components/ui/Form";
import {SelectInput} from "@Components/ui/Form/SelectInput.tsx";
import {ELanguage, EThemeOption, useLanguage, useTheme} from "../../../contexts";
import { useTranslation } from "react-i18next";

export const ApplicationSettings: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { themePreference, setThemePreference } = useTheme();
    const { t } = useTranslation();

    return <VStack gap="4" alignItems="stretch" w="100%">
        <Field label={t('settings.app.themeSetting.label')} type="select">
            <SelectInput
                isMandatoryValue
                value={themePreference}
                onChange={(val) => setThemePreference(val as EThemeOption)}
                options={[
                    { value: EThemeOption.System, label: t('settings.app.themeSetting.options.system') },
                    { value: EThemeOption.Light, label: t('settings.app.themeSetting.options.light') },
                    { value: EThemeOption.Dark, label: t('settings.app.themeSetting.options.dark') },
                ]}
            />
        </Field>
        <Field label={t('settings.app.languageSetting.label')} type="select">
            <SelectInput
                isMandatoryValue
                value={language}
                onChange={(val) => setLanguage(val as ELanguage)}
                options={[
                    { value: ELanguage.Czech, label: 'Čeština' },
                    { value: ELanguage.English, label: 'English' }
                ]}
            />
        </Field>
    </VStack>
}