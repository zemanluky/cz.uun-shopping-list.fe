import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Container} from "../../../styled-system/jsx";
import {AddCircleIcon} from "hugeicons-react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Text} from "@ParkComponents/ui";
import {useMemo, useRef} from "react";
import {useShoppingLists} from "../../contexts/ShoppingListsContext.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {ShoppingListGrid} from "@Components/features/ShoppingList/ShoppingListGrid.tsx";

export const Homepage: React.FC = () => {
    const {isAuthenticated, user} = useAuth();
    const {shoppingLists} = useShoppingLists();

    const shoppingListModalRef = useRef<IShoppingListModalRef>(null);

    const usersItems = useMemo(
        () => shoppingLists.filter(listItem => user && (listItem.author_id === user.id || listItem.members.includes(user.id))),
        [shoppingLists, user]
    );

    return <>
        <PageHeader
            title="Tvoje nákupní seznamy"
            actions={isAuthenticated ? <>
                <Button size='xl' onClick={() => shoppingListModalRef.current?.openModal()}>
                    <AddCircleIcon size={24} strokeWidth={2}/>
                    Nový nákupní seznam
                </Button>
            </> : undefined}
        />
        <Container maxW='6xl' mt='8'>
            {isAuthenticated
                ? <ShoppingListGrid shoppingLists={usersItems}/>
                : <Text fontWeight='semibold'>Prosím, přihlas se.</Text>
            }
        </Container>
        <ShoppingListModal ref={shoppingListModalRef}/>
    </>;
}