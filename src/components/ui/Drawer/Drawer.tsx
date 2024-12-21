import React, {ReactNode} from "react";
import {Drawer as ParkDrawer} from "@ParkComponents/ui";

interface IDrawerProps extends ParkDrawer.RootProps {
    isOpen: boolean;
    children: ReactNode;
}

export const Drawer: React.FC<IDrawerProps> = ({isOpen, children}) => {
    return <ParkDrawer.Root open={isOpen} lazyMount>
        <ParkDrawer.Backdrop/>
        <ParkDrawer.Positioner>
            <ParkDrawer.Content>
                {children}
            </ParkDrawer.Content>
        </ParkDrawer.Positioner>
    </ParkDrawer.Root>
}