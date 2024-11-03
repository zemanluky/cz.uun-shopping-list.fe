import * as React from "react";
import {PageHeader} from "../../components/layout/PageHeader.tsx";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Link} from "react-router-dom";
import {Container, Stack} from "../../../styled-system/jsx";
import {AddCircleIcon} from "hugeicons-react";
import {useAuth} from "../../contexts/AuthContext.tsx";

export const Homepage: React.FC = () => {
    const {isAuthenticated} = useAuth();

    return <>
        <PageHeader
            title="Vaše nákupní seznamy"
            actions={isAuthenticated ? <>
                <Button size='xl'>
                    <AddCircleIcon size={24} strokeWidth={2}/>
                    Vytvořit nákupní seznam
                </Button>
            </> : undefined}
        />
        <Container maxW='6xl' mt='8'>
            <Stack gap={2}>
                <Link to={'/1'}>První nákupní seznam</Link>
                <Link to={'/2'}>Druhý nákupní seznam</Link>
                <Link to={'/3'}>Třetí nákupní seznam</Link>
            </Stack>
        </Container>
    </>;
}