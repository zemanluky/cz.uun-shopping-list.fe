import React from "react";
import {Cancel01Icon} from "hugeicons-react";
import { Drawer as ParkDrawer } from "@ParkComponents/ui";
import {IconButton} from "@ParkComponents/ui/styled/icon-button.tsx";
import {HStack, VStack} from "../../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";

interface IProps {
    heading: string;
    description?: string;
    onCancel: () => void;
    processing?: boolean;
}

/** Heading to use in dialog component. Renders the title and close button. */
export const DrawerHeading: React.FC<IProps> = ({heading, description, processing, onCancel}) => {
    return <ParkDrawer.Header>
        <HStack justify="space-between">
            <ParkDrawer.Title>{heading}</ParkDrawer.Title>
            <IconButton variant='ghost' onClick={() => onCancel()} disabled={processing}>
                <Cancel01Icon size={32}/>
            </IconButton>
        </HStack>
        {description && <ParkDrawer.Description>{description}</ParkDrawer.Description>}
    </ParkDrawer.Header>;
};