import React from "react";
import {Navbar} from "@Components/layout/Navbar.tsx";
import { Outlet } from "react-router-dom";

export const PageWrapper: React.FC = () => {
    return <>
        <Navbar/>
        <Outlet/>
    </>;
}