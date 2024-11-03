import * as React from "react";
import {ReactNode} from "react";
import {AuthProvider} from "../contexts/AuthContext.tsx";

export const Providers: React.FC<{children?: ReactNode}> = ({children}) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}