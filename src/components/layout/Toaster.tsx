import { Toast } from "@ParkComponents/ui/toast";
import React from "react";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {Cancel01Icon} from "hugeicons-react";

export const toaster = Toast.createToaster({
    pauseOnPageIdle: true,
    placement: 'top',
    gap: 16,
});

export const Toaster: React.FC = () => {
    return <Toast.Toaster toaster={toaster}>
        {(toast) => (
            <Toast.Root key={toast.id} >
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
                <Toast.CloseTrigger asChild>
                    <IconButton size="sm" variant="link">
                        <HugeIcon icon={<Cancel01Icon/>}/>
                    </IconButton>
                </Toast.CloseTrigger>
            </Toast.Root>
        )}
    </Toast.Toaster>
}