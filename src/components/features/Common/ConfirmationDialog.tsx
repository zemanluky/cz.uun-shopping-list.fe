import {forwardRef, ReactElement, useImperativeHandle, useRef, useState} from "react";
import {Button, Text} from "@ParkComponents/ui";
import {Dialog, DialogButtons, DialogContent, DialogHeading} from "@Components/ui/Dialog";

interface IProps {
    title: string;
    description: string;
    content?: ReactElement;
    prompts?: {
        confirm?: string;
        cancel?: string;
    }
    onConfirmDefault?: () => void;
    onCancelDefault?: () => void;
}

export interface IConfirmationDialogRef {
    openModal: (onConfirm?: () => void, onCancel?: () => void) => void;
}

export const ConfirmationDialog = forwardRef<IConfirmationDialogRef, IProps>(
    ({title, description, content, prompts, onConfirmDefault, onCancelDefault}, ref) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const onConfirmRef = useRef<(() => void)|null>(null);
        const onCancelRef = useRef<(() => void)|null>(null);

        useImperativeHandle(ref, () => ({
            openModal: (onConfirm?: () => void, onCancel?: () => void) => {
                if (!onConfirmDefault && !onConfirm)
                    console.warn('No confirm callback provided.');

                onConfirmRef.current = onConfirm || null;
                onCancelRef.current = onCancel || null;

                setIsOpen(true);
            }
        }))

        /**
         * Cancels the action.
         */
        const cancel = () => {
            setIsOpen(false);
            onCancelRef.current ? onCancelRef.current() : onCancelDefault?.()
        }

        /**
         * Confirms the action.
         */
        const confirm = () => {
            setIsOpen(false);
            onConfirmRef.current ? onConfirmRef.current() : onConfirmDefault?.();
        }

        return <Dialog isOpen={isOpen}>
            <DialogHeading heading={title} onCancel={cancel}/>
            <DialogContent>
                {content || <Text>{description}</Text>}
            </DialogContent>
            <DialogButtons buttons={[
                <Button variant="subtle" onClick={cancel}>{prompts?.cancel || 'Zrušit'}</Button>,
                <Button onClick={confirm}>{prompts?.confirm || 'Potvrdit'}</Button>
            ]}/>
        </Dialog>;
    }
);