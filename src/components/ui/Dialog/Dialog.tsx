import React, {ReactNode} from "react";
import {Dialog as ParkDialog} from "@ParkComponents/ui";
import {css} from "../../../../styled-system/css";

interface DialogProps extends ParkDialog.RootProps {
    isOpen: boolean;
    children: ReactNode;
}

const dialogStyles = css({
    p: 6, minW: 'auto', mx: '4', w: "100%",
    md: { minW: '500px', maxW: '3xl', p: 8 }
})

export const Dialog: React.FC<DialogProps> = ({isOpen, children, ...dialogProps}) => {
    return (
        <ParkDialog.Root {...dialogProps} open={isOpen} lazyMount>
            <ParkDialog.Backdrop p={4} />
            <ParkDialog.Positioner>
                <ParkDialog.Content className={dialogStyles}>{children}</ParkDialog.Content>
            </ParkDialog.Positioner>
        </ParkDialog.Root>
    )
}