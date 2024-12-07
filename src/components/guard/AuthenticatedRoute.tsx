import React from "react";
import {EAuthStatus, useAuth} from "../../contexts";
import {Navigate} from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

export const AuthenticatedRoute: React.FC<IProps> = ({children}) => {
    const {authState} = useAuth();

    if (authState === EAuthStatus.Loading)
        return <></>;

    if (authState === EAuthStatus.Unauthenticated) {
        return <Navigate to="/auth"/>;
    }

    return children;
};