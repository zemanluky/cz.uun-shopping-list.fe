import React from "react";
import {VStack} from "../../../../styled-system/jsx";

interface IProps {
    children: React.ReactNode;
}

export const DialogContent: React.FC<IProps> = ({children}) => {
    return <VStack gap='2' my='4' alignItems='flex-start'>
        {children}
    </VStack>
};