import React from "react";
import {Navbar} from "@Components/layout/Navbar.tsx";
import { Outlet } from "react-router-dom";
import {Box} from "../../../styled-system/jsx";

export const PageWrapper: React.FC = () => {
    return <Box pb='8'>
        <Navbar/>
        <Outlet/>
    </Box>;
}