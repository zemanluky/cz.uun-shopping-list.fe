import React from "react";
import {Box} from "../../../styled-system/jsx";
import {Navbar} from "@Components/layout/Navbar.tsx";
import {Outlet} from "react-router-dom";

export const PageWrapper: React.FC = () => {
    return <Box pb='8'>
        <Navbar/>
        <Outlet/>
    </Box>;
}