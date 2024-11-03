import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {useEffect} from "react";
import {CheckmarkCircle02Icon} from "hugeicons-react";

export const Detail: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (!id) {
            // TODO: Change to own notification/alert system
            alert('Neplatné ID. Budete přesměrování na hlavní stránku.');
            navigate('/');
            return () => {};
        }
    }, []);

    return (<>
        <PageHeader
            title="Nákupní seznam"
            actions={<>
                <Button size='xl'>
                    <CheckmarkCircle02Icon size={24} strokeWidth={2}/>
                    Dokončit
                </Button>
            </>}
            previousLink='/'
        />
    </>);
}