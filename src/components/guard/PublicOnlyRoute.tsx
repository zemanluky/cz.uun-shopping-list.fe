import React from "react";
import {EAuthStatus, useAuth} from "../../contexts";
import {Navigate} from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<IProps> = ({children}) => {
    const {authState} = useAuth();

    if (authState === EAuthStatus.Loading)
        return <></>;

    if (authState === EAuthStatus.Authenticated) {
        return <Navigate to="/"/>;
    }

    return children;
}