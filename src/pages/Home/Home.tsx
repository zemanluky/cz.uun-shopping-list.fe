import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Container, VStack} from "../../../styled-system/jsx";
import {AddCircleIcon} from "hugeicons-react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Text} from "@ParkComponents/ui";
import {useRef, useState} from "react";
import {useShoppingLists} from "../../contexts/ShoppingListsContext.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {ShoppingListGrid} from "@Components/features/ShoppingList/ShoppingListGrid.tsx";
import {ShoppingListFilters, TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";

export const Homepage: React.FC = () => {
    const [filters, setFilters] = useState<TShoppingListFilters>({search: null, showCompleted: false, completeBefore: null});

    const {isAuthenticated} = useAuth();
    const {shoppingLists} = useShoppingLists();
    const shoppingListModalRef = useRef<IShoppingListModalRef>(null);

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
                ? <VStack gap='6'>
                    <ShoppingListFilters onFilterChange={(filters) => setFilters(filters)} w={'100%'}/>
                    <ShoppingListGrid shoppingLists={shoppingLists} w={'100%'} filter={filters}/>
                </VStack>
                : <Text fontWeight='semibold'>Prosím, přihlas se.</Text>
            }
        </Container>
        <ShoppingListModal ref={shoppingListModalRef}/>
    </>;
}