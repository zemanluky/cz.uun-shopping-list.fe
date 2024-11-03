import * as React from "react";
import {ReactNode} from "react";
import {AuthProvider, ShoppingListsProvider} from "../contexts";

export const Providers: React.FC<{children?: ReactNode}> = ({children}) => {
    return (
        <AuthProvider>
            <ShoppingListsProvider>
                {children}
            </ShoppingListsProvider>
        </AuthProvider>
    );
}