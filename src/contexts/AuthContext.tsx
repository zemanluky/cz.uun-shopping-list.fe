import * as React from 'react';
import {createContext, useContext, useState} from "react";
import {TUser} from "../types/auth.ts";

interface AuthContextType {
    user: TUser|null;
    isAuthenticated: boolean;
    login: (user: TUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<TUser|null>(null);

    /**
     * Logs a given user in.
     * @param user
     */
    const login = (user: TUser): void => {
        setUser(user);

        // TODO: Store JWT access token when integrating with backend
    }

    /**
     * Logs current user out - removes the currently set identity.
     */
    const logout = (): void => {
        setUser(null);

        // TODO: Remove saved access token
    }

    return <AuthContext.Provider value={{
        user,
        isAuthenticated: user !== null,
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