import * as React from "react";
import {ReactNode} from "react";
import {AuthProvider} from "../contexts";
import {ThemeProvider} from "../contexts/ThemeContext.tsx";
import {LanguageProvider} from "../contexts/LanguageContext.tsx";

export const Providers: React.FC<{children?: ReactNode}> = ({children}) => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}