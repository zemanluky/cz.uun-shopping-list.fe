import React from "react";
import {VStack} from "../../../../styled-system/jsx";
import { Drawer as ParkDrawer } from "@ParkComponents/ui";

interface IProps {
    children: React.ReactNode;
}

export const DrawerContent: React.FC<IProps> = ({children}) => {
    return <ParkDrawer.Content p={6}>
        <VStack gap='2' alignItems='flex-start'>
            {children}
        </VStack>
    </ParkDrawer.Content>
};