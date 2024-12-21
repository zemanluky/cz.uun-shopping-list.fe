import * as React from "react";
import {ReactNode} from "react";
import {AuthProvider} from "../contexts";
import {ThemeProvider} from "../contexts/ThemeContext.tsx";

export const Providers: React.FC<{children?: ReactNode}> = ({children}) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}