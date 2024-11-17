import React, {ReactNode} from "react";
import {Dialog as ParkDialog} from "@ParkComponents/ui";
import {css} from "../../../../styled-system/css";

interface DialogProps {
    isOpen: boolean;
    children: ReactNode;
}

const dialogStyles = css({
    px: 8, py: 6, minW: 'auto', mx: '4',
    md: { minW: '500px', maxW: '4xl' }
})

export const Dialog: React.FC<DialogProps> = ({isOpen, children}) => {
    return (
        <ParkDialog.Root open={isOpen}>
            <ParkDialog.Backdrop p={4} />
            <ParkDialog.Positioner>
                <ParkDialog.Content className={dialogStyles}>{children}</ParkDialog.Content>
            </ParkDialog.Positioner>
        </ParkDialog.Root>
    )
}