import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Link} from "react-router-dom";
import {Container, Stack} from "../../../styled-system/jsx";
import {AddCircleIcon} from "hugeicons-react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Text} from "@ParkComponents/ui";
import {useMemo} from "react";
import {shoppingLists} from "../../data/shopping-lists.ts";
import {ShoppingList} from "../../types/shopping-list.ts";

export const Homepage: React.FC = () => {
    const {isAuthenticated, user} = useAuth();

    const usersItems = useMemo<Array<ShoppingList>>(
        () => shoppingLists.filter(listItem => user && (listItem.author_id === user.id || listItem.members.includes(user.id))),
        [shoppingLists, user]
    );

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
            {isAuthenticated
                ? <Stack gap={2}>
                    {usersItems.map(usersItem => <Link key={usersItem.id} to={`/${usersItem.id}`}>{usersItem.name}</Link>)}
                </Stack>
                : <Text fontWeight='semibold'>Prosím, přihlaste se.</Text>
            }
        </Container>
    </>;
}