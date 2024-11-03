import React, {ReactNode} from "react";
import {Dialog as ParkDialog} from "@ParkComponents/ui";

interface DialogProps {
    isOpen: boolean;
    children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({isOpen, children}) => {
    return (
        <ParkDialog.Root open={isOpen}>
            <ParkDialog.Backdrop />
            <ParkDialog.Positioner>
                <ParkDialog.Content css={{ px: 8, py: 6 }}>{children}</ParkDialog.Content>
            </ParkDialog.Positioner>
        </ParkDialog.Root>
    )
}