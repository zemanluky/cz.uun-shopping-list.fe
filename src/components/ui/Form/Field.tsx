import React, {ReactNode, useMemo} from "react";
import { Field as ParkField } from "@ParkComponents/ui/field";

type TRenderType = 'input'|'textarea'|'select';

interface IProps {
    label?: string,
    children: ReactNode,
    type?: TRenderType
    errors?: Array<string>
}

export const Field: React.FC<IProps> = ({label, errors, children, type}) => {
    const hasError = useMemo<boolean>(() => !!errors && errors.length > 0, [errors]);
    const errorsComponent = useMemo<ReactNode|null>(() => {
        if (!hasError) return null;

        return <ParkField.ErrorText>
            {errors?.map(err => <span key={err}>{err}</span>)}
        </ParkField.ErrorText>
    }, [errors, hasError]);

    /**
     * Renders the control based on the type of the field.
     */
    const renderControl = (): ReactNode => {
        switch (type) {
            case 'select':
                return <ParkField.Select asChild>
                    {children}
                </ParkField.Select>

            case 'textarea':
                return <ParkField.Textarea asChild>
                    {children}
                </ParkField.Textarea>

            case 'input':
            default:
                return <ParkField.Input asChild>
                    {children}
                </ParkField.Input>
        }
    }

    return <ParkField.Root invalid={hasError}>
        {label ? <ParkField.Label>{label}</ParkField.Label> : null}
        {renderControl()}
        {errorsComponent}
    </ParkField.Root>
}