import React, {ReactNode, useState} from "react";
import {Button, Heading, Text} from "@ParkComponents/ui";
import {Dialog} from "@Components/ui/Dialog";
import {Divider, Grid, HStack, VStack} from "../../../../styled-system/jsx";
import {Cancel01Icon} from "hugeicons-react";

interface ConfirmationDialogProps {
    title: string;
    description?: string;
    prompts?: {
        confirm?: string;
        cancel?: string;
    }
    onConfirm: () => void;
    onCancel?: () => void;
    trigger: (setOpen: () => void) => ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {title, description, prompts, onConfirm, onCancel, trigger} = props;

    const cancel = () => {
        setIsOpen(false);
        onCancel?.();
    }

    const confirm = () => {
        setIsOpen(false);
        onConfirm();
    }

    return <>
        {trigger(() => setIsOpen(true))}
        <Dialog isOpen={isOpen}>
            <VStack gap='2' alignItems='flex-start'>
                <HStack justifyContent='space-between' w='100%'>
                    <Heading as='h3' fontSize='2xl'>{title}</Heading>
                    <Button variant='ghost' onClick={() => cancel()} css={{p: 2, position: 'relative', right: -2}}>
                        <Cancel01Icon size={32}/>
                    </Button>
                </HStack>
                {!!description && <Text>{description}</Text>}
            </VStack>
            <Divider my={8}/>
            <Grid gap={2} columns={2}>
                <Button variant={'subtle'} onClick={() => cancel()}>{prompts?.cancel || 'Zrušit'}</Button>
                <Button onClick={() => confirm()}>{prompts?.confirm || 'Potvrdit'}</Button>
            </Grid>
        </Dialog>
    </>;
}