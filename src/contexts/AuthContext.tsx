import * as React from 'react';
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {TUser} from "../types/user.ts";
import {deleteAccessToken, getAccessToken, saveAccessToken} from "@Utils/access-token.utils.ts";
import {authenticatedFetcher} from "@Utils/axios.config.ts";
import {apiRoutes} from "../config/api/routes.ts";
import useSWRMutation from "swr/mutation";
import {logoutMutator} from "../data/mutator/auth.ts";
import useSWR from "swr";

export enum EAuthStatus {
    Loading,
    Authenticated,
    Unauthenticated
}

interface AuthContextType {
    authState: EAuthStatus;
    user: TUser|null;
    login: (accessToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string|null>();

    const {data: user, isLoading, mutate} = useSWR<TUser>(
        () => accessToken ? apiRoutes.auth.identity[1] : null,
        {fetcher: authenticatedFetcher, revalidateOnFocus: false}
    );
    const {trigger, isMutating} = useSWRMutation(apiRoutes.auth.identity[1], logoutMutator, { revalidate: false });

    useEffect(() => setAccessToken(getAccessToken()), []);

    useEffect(() => { mutate() }, [accessToken]);

    const authState = useMemo<EAuthStatus>(() => {
        if (isLoading || isMutating) return EAuthStatus.Loading;
        if (user && accessToken) return EAuthStatus.Authenticated;

        return EAuthStatus.Unauthenticated;
    }, [isLoading, isMutating, user, accessToken]);

    /**
     * Sets the authentication token.
     * @param accessToken
     */
    const login = (accessToken: string): void => {
        saveAccessToken(accessToken);
        setAccessToken(accessToken);
    }

    /**
     * Logs current user out - removes the current access token.
     */
    const logout = (): void => {
        if (!accessToken) return;

        trigger().then(() => {
            deleteAccessToken();
            setAccessToken(null);
        });
    }

    return <AuthContext.Provider value={{
        authState,
        user: user || null,
        login, logout
    }}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);

    if (!ctx)
        throw new Error(
            "The 'useAuth' hook may only be used in components wrapped inside the AuthContextProvider. " +
            "Please, ensure your component is inside the provider."
        );

    return ctx;
}