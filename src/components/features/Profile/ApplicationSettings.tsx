import React from "react";
import {VStack} from "../../../../styled-system/jsx";
import {Field} from "@Components/ui/Form";
import {SelectInput} from "@Components/ui/Form/SelectInput.tsx";
import {ELanguage, EThemeOption, useLanguage, useTheme} from "../../../contexts";

export const ApplicationSettings: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { themePreference, setThemePreference } = useTheme();

    return <VStack gap="4" alignItems="stretch" w="100%">
        <Field label="Motiv aplikace" type="select">
            <SelectInput
                isMandatoryValue
                value={themePreference}
                onChange={(val) => setThemePreference(val as EThemeOption)}
                options={[
                    { value: EThemeOption.System, label: 'Podle systému' },
                    { value: EThemeOption.Light, label: 'Světlý' },
                    { value: EThemeOption.Dark, label: 'Tmavý' },
                ]}
            />
        </Field>
        <Field label="Jazyk aplikace" type="select">
            <SelectInput
                isMandatoryValue
                value={language}
                onChange={(val) => setLanguage(val as ELanguage)}
                options={[
                    { value: ELanguage.Czech, label: 'Čeština' },
                    { value: ELanguage.English, label: 'Angličtina' }
                ]}
            />
        </Field>
    </VStack>
}