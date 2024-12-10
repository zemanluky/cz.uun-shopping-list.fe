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
    processing?: boolean;
    onConfirmDefault?: () => void;
    onCancelDefault?: () => void;
    autoClose?: boolean;
}

export interface IConfirmationDialogRef {
    /**
     * Opens the modal.
     * @param onConfirm Function that will be called once the user confirms the action.
     *                  The function may optionally accept `finalizeClose` method that can be called to close the modal.
     *                  When the parameter is not present, the dialog will close itself automatically.
     * @param onCancel Function that will be called once the user cancels the action.
     *                 The function may optionally accept `finalizeClose` method that can be called to close the modal.
     *                 When the parameter is not present, the dialog will close itself automatically.
     */
    openModal: (
        onConfirm: (() => void)|((finalizeClose?: VoidFunction) => void),
        onCancel?: (() => void)|((finalizeClose?: VoidFunction) => void)
    ) => void;
}

export const ConfirmationDialog = forwardRef<IConfirmationDialogRef, IProps>(
    ({title, description, content, prompts, processing, onConfirmDefault, onCancelDefault}, ref) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const onConfirmRef = useRef<((finalizeClose?: VoidFunction) => void)|null>(null);
        const onCancelRef = useRef<((finalizeClose?: VoidFunction) => void)|null>(null);

        useImperativeHandle(ref, () => ({
            openModal: (
                onConfirm?: (finalizeClose?: VoidFunction) => void,
                onCancel?: (finalizeClose?: VoidFunction) => void
            ) => {
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
            // the cancel callback was provided
            if (onCancelRef.current && onCancelRef.current.length > 0) {
                onCancelRef.current(() => setIsOpen(false));
                return;
            }

            setIsOpen(false);
            onCancelRef.current ? onCancelRef.current() : onCancelDefault?.()
        }

        /**
         * Confirms the action.
         */
        const confirm = () => {
            // the confirmation callback was provided
            if (onConfirmRef.current && onConfirmRef.current.length > 0) {
                onConfirmRef.current(() => setIsOpen(false));
                return;
            }

            setIsOpen(false);
            onConfirmRef.current ? onConfirmRef.current() : onConfirmDefault?.()

        }

        return <Dialog isOpen={isOpen}>
            <DialogHeading heading={title} onCancel={cancel}/>
            <DialogContent>
                {content || <Text>{description}</Text>}
            </DialogContent>
            <DialogButtons buttons={[
                <Button variant="subtle" onClick={cancel} disabled={processing}>{prompts?.cancel || 'Zrušit'}</Button>,
                <Button onClick={confirm} loading={processing}>{prompts?.confirm || 'Potvrdit'}</Button>
            ]}/>
        </Dialog>;
    }
);