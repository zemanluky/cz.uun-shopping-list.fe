import React from "react";
import {HStack} from "../../../../styled-system/jsx";
import {Button, Heading} from "@ParkComponents/ui";
import {Cancel01Icon} from "hugeicons-react";

interface IProps {
    heading: string;
    onCancel: () => void;
    processing?: boolean;
}

/** Heading to use in dialog component. Renders the title and close button. */
export const DialogHeading: React.FC<IProps> = ({heading, onCancel, processing}) => {
    return <HStack justifyContent='space-between' w='100%'>
        <Heading as='h3' fontSize='2xl'>{heading}</Heading>
        <Button variant='ghost' onClick={() => onCancel()} css={{p: 2, position: 'relative', right: -2}} disabled={processing}>
            <Cancel01Icon size={32}/>
        </Button>
    </HStack>
};