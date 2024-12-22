import React, {ReactElement, ReactNode, useMemo} from "react";
import { Field as ParkField } from "@ParkComponents/ui/field";

type TRenderType = 'input'|'textarea'|'select'|'any';

interface IProps extends ParkField.RootProps{
    label?: string|null,
    children: ReactElement,
    type?: TRenderType
    errors?: Array<string>
}

export const Field: React.FC<IProps> = ({label, errors, children, type, ...fieldProps}) => {
    const hasError = useMemo<boolean>(() => !!errors && errors.length > 0, [errors]);
    const errorsComponent = useMemo<ReactNode|null>(() => {
        if (!hasError) return null;

        return <ParkField.ErrorText flexDir="column" alignItems="flex-start" gap={0}>
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

            case 'any':
                return React.cloneElement(children, {"aria-invalid": hasError});

            case 'input':
            default:
                return <ParkField.Input asChild>
                    {children}
                </ParkField.Input>
        }
    }

    return <ParkField.Root {...fieldProps} invalid={hasError}>
        {label !== null ? <ParkField.Label>
            {label && label.length
                ? label
                : "\u00a0"
            }
        </ParkField.Label> : null}
        {renderControl()}
        {errorsComponent}
    </ParkField.Root>
}