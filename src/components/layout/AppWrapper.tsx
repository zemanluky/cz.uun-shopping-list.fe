import React from "react";
import {EAuthStatus, useAuth, useLanguage} from "src/contexts";
import {Outlet} from "react-router-dom";
import {Center} from "../../../styled-system/jsx";
import {Spinner} from "@ParkComponents/ui";
import {css} from "../../../styled-system/css";

const appStyles = css({
    bg: "accent.2",
    minHeight: "100vh",
    '@supports (min-height: 100svh)': {
        minHeight: '100svh'
    }
});

export const AppWrapper: React.FC = () => {
    const {authState} = useAuth();
    const {isLoading} = useLanguage();

    if (authState === EAuthStatus.Loading || isLoading)
        return <Center bg="accent.2" className={appStyles}>
            <Spinner size="xl" borderWidth="4"/>
        </Center>;

    return <Outlet/>;
}