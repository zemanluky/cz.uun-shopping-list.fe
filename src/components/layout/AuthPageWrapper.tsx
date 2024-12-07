import React from "react";
import {Center} from "../../../styled-system/jsx";
import {Outlet} from "react-router-dom";
import {css} from "../../../styled-system/css";

const appStyles = css({
    bg: "accent.2",
    minHeight: "100vh",
    '@supports (min-height: 100svh)': {
        minHeight: '100svh'
    }
});

export const AuthPageWrapper: React.FC = () => {
    return <Center className={appStyles}>
        <Outlet/>
    </Center>
};